import { prisma } from "@/db";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export default new OpenAPIHono().openapi(
	createRoute({
		method: "delete",
		path: "/todos/{todoId}",
		summary: "TODOの削除",
		tags: ["todos"],
		request: {
			params: z.object({
				todoId: z.string().min(3).openapi({
					example: "1212121",
				}),
			}),
		},
		responses: {
			200: {
				description: "Success to delete the todo",
				content: {
					"application/json": {
						schema: z.object({
							ok: z.boolean().openapi({}),
						}),
					},
				},
			},
		},
	}),
	async (c) => {
		const { todoId } = c.req.valid("params");

		await prisma.todo.delete({
			where: { id: parseInt(todoId) },
		});

		return c.json({
			ok: true,
		});
	},
);
