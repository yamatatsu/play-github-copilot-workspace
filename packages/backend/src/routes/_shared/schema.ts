import { z } from "@hono/zod-openapi";

export const error400Schema = z.object({
	message: z.string().openapi({
		example: "Bad Request",
	}),
});

export const todoSchema = z
	.object({
		id: z.number().openapi({}),
		title: z.string().openapi({
			example: "Buy milk",
		}),
	})
	.openapi("TODO");
