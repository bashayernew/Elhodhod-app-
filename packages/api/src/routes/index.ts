import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./health";
import { userRoutes } from "./users";

export function registerRoutes(app: FastifyInstance) {
	app.register(healthRoutes, { prefix: "/health" });
	app.register(userRoutes, { prefix: "/users" });
}


