import "dotenv/config";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import { registerRoutes } from "./routes";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as Sentry from "@sentry/node";
import Redis from "ioredis";
import idempotencyPlugin from "./plugins/idempotency";
import { PrismaClient } from "@prisma/client";

const app = Fastify({
  logger: { level: process.env.NODE_ENV === "production" ? "info" : "debug" },
}).withTypeProvider<ZodTypeProvider>();

const corsOrigins = (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : [
  "http://localhost:3001",
]);
await app.register(cors as unknown as FastifyPluginAsync, {
  origin: corsOrigins,
  credentials: true,
});
await app.register(helmet as unknown as FastifyPluginAsync);
await app.register(fastifyCookie as unknown as FastifyPluginAsync);
await app.register(fastifyJwt as unknown as FastifyPluginAsync, { secret: process.env.JWT_SECRET || "dev_secret" });
await app.register(rateLimit as unknown as FastifyPluginAsync, {
  max: 100,
  timeWindow: "1 minute",
  keyGenerator: (req) => {
    const auth = (req as any).user as { id?: string } | undefined;
    return auth?.id || req.ip;
  },
});

// Remove X-Powered-By
app.addHook("onSend", async (req, reply, payload) => {
  reply.header("X-Powered-By", undefined as any);
  return payload as any;
});

// Parse JWT from cookie or Bearer for downstream handlers
app.addHook("onRequest", async (req) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    // @ts-ignore
    const tokenFromCookie = (req.cookies && (req.cookies as any).token) as string | undefined;
    const token = tokenFromHeader || tokenFromCookie;
    if (token) {
      // @ts-ignore
      (req as any).user = await app.jwt.verify(token);
    }
  } catch {
    // ignore invalid tokens on public routes
  }
});
await app.register(swagger as unknown as FastifyPluginAsync, {
	openapi: {
		info: { title: "el-hodh0d API", version: "0.1.0" },
		servers: [{ url: "http://localhost:5000" }],
	},
});
await app.register(swaggerUI as unknown as FastifyPluginAsync, { routePrefix: "/docs" });

// Sentry (optional)
if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

// Idempotency (only if Redis configured)
let redis: Redis | null = null;
try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
    await app.register(idempotencyPlugin, { redis });
  }
} catch (e) {
  app.log.warn({ err: e }, "Redis not available; idempotency disabled");
}

registerRoutes(app);

// Health endpoints
app.get("/live", async () => ({ ok: true }));
app.get("/ready", async () => ({ ok: true }));

// Centralized error handler (no internals leaked)
app.setErrorHandler((err, req, reply) => {
  app.log.error({ err, requestId: req.id }, "Unhandled error");
  const status = (err as any).statusCode ?? 500;
  reply.status(status).send({ message: status >= 500 ? "Internal Server Error" : err.message, requestId: req.id });
});

// Prisma fail-fast with timeout and graceful shutdown
const prisma = new PrismaClient();
const connectWithTimeout = async () => {
  await Promise.race([
    prisma.$connect(),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Prisma connection timeout")), 7000)),
  ]);
};

try {
  await connectWithTimeout();
} catch (e) {
  console.error("[API] Prisma failed to connect", e);
  process.exit(1);
}

const port = Number(process.env.PORT ?? 5000);
await app
  .listen({ host: "0.0.0.0", port })
  .catch((e) => {
    console.error("[API] Failed to listen", e);
    process.exit(1);
  });
app.log.info(`API listening on http://localhost:${port}`);

const shutdown = async () => {
  try {
    await app.close();
  } finally {
    await prisma.$disconnect();
  }
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


