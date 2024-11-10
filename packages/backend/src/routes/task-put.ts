import { prisma } from "@/db";
import { Hono } from "hono";
import { z } from "zod";
import {
	authorizationHeaderValidator,
	jsonValidator,
	paramValidator,
} from "./_shared/validators";

export default new Hono().put(
	"/tasks/:taskId",
	authorizationHeaderValidator(),
	paramValidator(
		z.object({
			taskId: z.string().regex(/^\d+$/).transform(Number),
		}),
	),
	jsonValidator(
		z.object({
			title: z.string(),
			content: z.string(),
			done: z.boolean(),
		}),
	),
	async (c) => {
		const { taskId } = c.req.valid("param");
		const { title, content, done } = c.req.valid("json");

		const task = await prisma.task.update({
			where: {
				id: taskId,
			},
			data: {
				title,
				content,
				done,
			},
		});

		return c.json(task, 200);
	},
);
