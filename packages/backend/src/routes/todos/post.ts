import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { decode, sign, verify } from "hono/jwt";

const ErrorSchema = z.object({
	message: z.string().openapi({
		example: "Bad Request",
	}),
});

export default new OpenAPIHono().openapi(
	createRoute({
		method: "post",
		path: "/todos",
		summary: "TODOの作成",
		tags: ["todos"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							title: z.string().openapi({
								example: "Buy milk",
							}),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success to create the todo",
				content: {
					"application/json": {
						schema: z
							.object({
								id: z.string().openapi({
									example: "123",
								}),
								title: z.string().openapi({
									example: "Buy milk",
								}),
							})
							.openapi("TODO"),
					},
				},
			},
			400: {
				description: "Returns an error",
				content: {
					"application/json": {
						schema: ErrorSchema,
					},
				},
			},
		},
	}),
	(c) => {
		const { title } = c.req.valid("json");
		// TODO: Implement the create logic
		return c.json(
			{
				id: "123",
				title,
			},
			200,
		);
	},
	// validation error hook
	(result, c) => {
		if (!result.success) {
			return c.json(
				{
					message: "Bad Request",
					details: result.error.flatten(),
				},
				400,
			);
		}
	},
);
