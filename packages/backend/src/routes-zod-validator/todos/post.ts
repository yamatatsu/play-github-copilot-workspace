import { prisma } from "@/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { jsonHook } from "../_shared/validationHook";

export default new Hono().post(
	"/todos",
	zValidator(
		"json",
		z.object({
			title: z.string().openapi({
				example: "Buy milk",
			}),
			content: z.string().openapi({
				example: "Buy milk",
			}),
		}),
		jsonHook,
	),
	async (c) => {
		const { title, content } = c.req.valid("json");

		const { sub } = c.get("jwtPayload");

		const todo = await prisma.task.create({
			data: {
				title,
				content,
				createdBy: sub,
			},
		});

		return c.json(todo, 200);
	},
);
