import { prisma } from "@/db";
import { Hono } from "hono";

export default new Hono().get("/todos", async (c) => {
	const todos = await prisma.task.findMany();
	return c.json(todos, 200);
});
