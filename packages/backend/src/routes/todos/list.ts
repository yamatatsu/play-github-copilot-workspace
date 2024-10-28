import { prisma } from "@/db";
import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "../_shared/openapiRoute";
import { todoSchema } from "../_shared/schema";
export default openapiRoute().openapi(
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
