import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { decode, sign, verify } from "hono/jwt";

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
	(c) => {
		const { todoId } = c.req.valid("param");
		return c.json({
			// TODO: Implement the delete logic
			ok: true,
		});
	},
);
