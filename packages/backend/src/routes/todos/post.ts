import { prisma } from "@/db";
import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "../_shared/openapiRoute";
import { error400Schema, todoSchema } from "../_shared/schema";

export default openapiRoute().openapi(
	createRoute({
		method: "post",
		path: "/todos",
		summary: "TODOの作成",
		tags: ["todos"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							title: z.string().openapi({
								example: "Buy milk",
							}),
							content: z.string().openapi({
								example: "Buy milk",
							}),
						}),
					},
				},
			},
			headers: z.object({
				authorization: z.string(),
			}),
		},
		responses: {
			200: {
				description: "Success to create the todo",
				content: {
					"application/json": {
						schema: todoSchema,
					},
				},
			},
			400: {
				description: "Returns an error",
				content: {
					"application/json": {
						schema: error400Schema,
					},
				},
			},
		},
	}),
	async (c) => {
		const { title, content } = c.req.valid("json");

		const { sub } = c.get("jwtPayload");

		const todo = await prisma.todo.create({
			data: {
				title,
				content,
				createdBy: sub,
			},
		});

		return c.json(todo, 200);
	},
);
