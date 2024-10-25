import { prisma } from "@/db";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { todoSchema } from "../_shared/schema";

export default new OpenAPIHono().openapi(
	createRoute({
		method: "get",
		path: "/todos",
		summary: "Fetch TODOs",
		tags: ["todos"],
		request: {
			headers: z.object({
				authorization: z.string(),
			}),
		},
		responses: {
			200: {
				description: "Success to fetch the todos",
				content: {
					"application/json": {
						schema: z.array(todoSchema),
					},
				},
			},
		},
	}),
	async (c) => {
		const todos = await prisma.todo.findMany();
		return c.json(todos, 200);
	},
);
