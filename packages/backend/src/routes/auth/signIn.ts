import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";
import { decode, sign, verify } from "hono/jwt";
import env from "../../utils/env";

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

		const jwt = await sign(
			{
				iss: "https://github.com/yamatatsu/play-github-copilot-workspace",
				aud: "https://github.com/yamatatsu/play-github-copilot-workspace",
				name,
			},
			env.JWT_SECRET,
		);

		setCookie(c, "token", jwt, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
		});

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
