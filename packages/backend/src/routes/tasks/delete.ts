import { prisma } from "@/db";
import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "../_shared/openapiRoute";

export default openapiRoute().openapi(
	createRoute({
		method: "delete",
		path: "/tasks/{taskId}",
		summary: "taskの削除",
		tags: ["tasks"],
		request: {
			params: z.object({
				taskId: z.string().regex(/^\d+$/).transform(Number),
			}),
			headers: z.object({
				authorization: z.string(),
			}),
		},
		responses: {
			200: {
				description: "Success to delete the task",
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
		const { taskId } = c.req.valid("param");

		await prisma.task.delete({
			where: {
				id: taskId,
			},
		});

		return c.json({
			ok: true,
		});
	},
);
