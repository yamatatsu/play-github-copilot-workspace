import { prisma } from "@/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { paramHook } from "../_shared/validationHook";

export default new Hono().delete(
	"/todos/:todoId",
	zValidator(
		"param",
		z.object({
			todoId: z.string().regex(/^\d+$/).transform(Number),
		}),
		paramHook,
	),
	async (c) => {
		const { todoId } = c.req.valid("param");

		await prisma.todo.delete({
			where: {
				id: todoId,
			},
		});

		return c.json({
			ok: true,
		});
	},
);
