import { prisma } from "@/db";
import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "../_shared/openapiRoute";

export default openapiRoute().openapi(
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

		await prisma.task.delete({
			where: {
				id: todoId,
			},
		});

		return c.json({
			ok: true,
		});
	},
);
