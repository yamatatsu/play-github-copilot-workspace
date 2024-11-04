import { prisma } from "@/db";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { paramHook } from "../_shared/validationHook";

export default new Hono().delete(
	"/tasks/:taskId",
	zValidator(
		"param",
		z.object({
			taskId: z.string().regex(/^\d+$/).transform(Number),
		}),
		paramHook,
	),
	async (c) => {
		const { taskId } = c.req.valid("param");

		await prisma.task.delete({
			where: {
				id: taskId,
			},
		});

		return c.json({
			ok: true,
		});
	},
);
