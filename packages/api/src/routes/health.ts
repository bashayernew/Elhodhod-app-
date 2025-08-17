import type { FastifyInstance } from "fastify";
import { healthSchema } from "@el-hodh0d/types";

export async function healthRoutes(app: FastifyInstance) {
	app.get("/", {
		schema: {
			summary: "Health check",
			response: {
				200: {
					type: "object",
					properties: { status: { type: "string", enum: ["ok"] } },
				},
			},
		},
		handler: async () => healthSchema.parse({ status: "ok" }),
	});

	app.get("/live", async () => ({ status: "ok" }));
	app.get("/ready", async () => ({ status: "ok" }));
}


