import { prisma } from "@/db";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { error400Schema, todoSchema } from "../_shared";

export default new OpenAPIHono().openapi(
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
						}),
					},
				},
			},
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
		const { title } = c.req.valid("json");

		const todo = await prisma.todo.create({
			data: {
				title,
				content: "test-content",
				createdBy: "test-user",
			},
		});

		return c.json(todo, 200);
	},
);
