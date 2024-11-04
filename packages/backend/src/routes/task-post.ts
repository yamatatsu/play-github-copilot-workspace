import { prisma } from "@/db";
import { Hono } from "hono";
import { z } from "zod";
import {
	authorizationHeaderValidator,
	jsonValidator,
} from "./_shared/validators";

export default new Hono().post(
	"/tasks",
	authorizationHeaderValidator(),
	jsonValidator(
		z.object({
			title: z.string(),
			content: z.string(),
		}),
	),
	async (c) => {
		const { title, content } = c.req.valid("json");

		const { sub } = c.get("jwtPayload");

		const task = await prisma.task.create({
			data: {
				title,
				content,
				createdBy: sub,
			},
		});

		return c.json(task, 200);
	},
);
