import { prisma } from "@/db";
import { Hono } from "hono";
import { authorizationHeaderValidator } from "./_shared/validators";

export default new Hono().get(
	"/tasks",
	authorizationHeaderValidator(),
	async (c) => {
		const tasks = await prisma.task.findMany();
		return c.json(tasks, 200);
	},
);
