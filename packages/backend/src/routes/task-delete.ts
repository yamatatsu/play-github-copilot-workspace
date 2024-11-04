import { prisma } from "@/db";
import { Hono } from "hono";
import { z } from "zod";
import {
	authorizationHeaderValidator,
	paramValidator,
} from "./_shared/validators";

export default new Hono().delete(
	"/tasks/:taskId",
	authorizationHeaderValidator(),
	paramValidator(
		z.object({
			taskId: z.string().regex(/^\d+$/).transform(Number),
		}),
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
