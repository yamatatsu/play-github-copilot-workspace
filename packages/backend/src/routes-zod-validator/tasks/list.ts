import { prisma } from "@/db";
import { Hono } from "hono";

export default new Hono().get("/tasks", async (c) => {
	const tasks = await prisma.task.findMany();
	return c.json(tasks, 200);
});
