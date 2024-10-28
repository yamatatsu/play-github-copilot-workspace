import { OpenAPIHono } from "@hono/zod-openapi";

export function openapiRoute() {
	return new OpenAPIHono({
		defaultHook: (result, c) => {
			if (!result.success) {
				return c.json(
					{
						code: "schema_validation_failed",
						message: "Bad Request",
						errors: result.error.flatten(),
					},
					400,
				);
			}
		},
	});
}
