import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

export default new OpenAPIHono().openapi(
	createRoute({
		method: "get",
		path: "/",
		summary: "For health check",
		responses: {
			200: {
				description: "health check",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string().openapi({
								example: "Hello Node.js!",
							}),
						}),
					},
				},
			},
		},
	}),
	(c) => {
		return c.json({
			message: "Hello Node.js!",
		});
	},
);
