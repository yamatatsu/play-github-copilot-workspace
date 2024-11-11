import { prisma } from "@/db";
import { Hono } from "hono";
import { authorizationHeaderValidator } from "./_shared/validators";

export default new Hono().get(
	"/tasks",
	authorizationHeaderValidator(),
	async (c) => {
		const { sub } = c.get("jwtPayload");
		const tasks = await prisma.task.findMany({
			where: { createdBy: sub },
		});
		return c.json(tasks, 200);
	},
);
