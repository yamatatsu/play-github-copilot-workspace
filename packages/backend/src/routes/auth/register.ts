import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../../db";

const ErrorSchema = z.object({
	message: z.string().openapi({
		example: "Bad Request",
	}),
});

export default new OpenAPIHono().openapi(
	createRoute({
		method: "put",
		path: "/auth/register",
		summary: "Userの登録",
		tags: ["auth"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							name: z.string().openapi({
								description: "ユーザー名",
								example: "John",
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
						schema: z.object({
							ok: z.boolean(),
						}),
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
	async (c) => {
		const { name } = c.req.valid("json");

		await prisma.user.create({ data: { name } });

		return c.json({ ok: true }, 200);
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
