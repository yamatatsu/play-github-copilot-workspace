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
				todoId: z.string().regex(/^\d+$/).transform(Number),
			}),
			headers: z.object({
				authorization: z.string(),
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
		const { todoId } = c.req.valid("param");

		await prisma.todo.delete({
			where: {
				id: todoId,
			},
		});

		return c.json({
			ok: true,
		});
	},
);
