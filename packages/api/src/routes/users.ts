import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { createUserInputSchema, userSchema } from "@el-hodh0d/types";

const prisma = new PrismaClient();

export async function userRoutes(app: FastifyInstance) {
	app.get("/", {
		schema: {
			summary: "List users",
			response: {
				200: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string" },
							email: { type: "string" },
							name: { type: "string" },
							createdAt: { type: "string", format: "date-time" },
						},
					},
				},
			},
		},
		handler: async () => {
			const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
			return users.map((u) =>
				userSchema.parse({
					id: u.id,
					email: u.email,
					name: u.name,
					createdAt: u.createdAt.toISOString(),
				})
			);
		},
	});

	app.post<{ Body: unknown }>("/", {
		schema: {
			summary: "Create user",
			body: {
				type: "object",
				properties: { email: { type: "string" }, name: { type: "string" } },
				required: ["email", "name"],
			},
			response: {
				201: {
					type: "object",
					properties: {
						id: { type: "string" },
						email: { type: "string" },
						name: { type: "string" },
						createdAt: { type: "string", format: "date-time" },
					},
				},
			},
		},
		handler: async (req, reply) => {
			const input = createUserInputSchema.parse(req.body);
			const created = await prisma.user.create({ data: input });
			const data = userSchema.parse({
				id: created.id,
				email: created.email,
				name: created.name,
				createdAt: created.createdAt.toISOString(),
			});
			return reply.code(201).send(data);
		},
	});
}


