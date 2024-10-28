import { createRoute, z } from "@hono/zod-openapi";
import { openapiRoute } from "./_shared/openapiRoute";

export default openapiRoute().openapi(
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
