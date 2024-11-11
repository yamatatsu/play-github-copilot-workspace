import { prisma } from "@/db";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import route from "./task-list";

const app = new Hono()
	.use("/*", (c, next) => {
		c.set("jwtPayload", { sub: "user1" });
		return next();
	})
	.route("/", route);
const client = testClient(app);

test("response when 200", async () => {
	const tasks = [
		{
			id: 1,
			title: "Test TASK 1",
			content: "Content 1",
			done: false,
			createdBy: "user1",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 2,
			title: "Test TASK 2",
			content: "Content 2",
			done: false,
			createdBy: "user2",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	await prisma.task.createMany({
		data: tasks,
	});

	const res = await client.tasks.$get({
		header: { authorization: "Bearer xxx" },
	});

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual([
		{
			...tasks[0],
			createdAt: tasks[0].createdAt.toISOString(),
			updatedAt: tasks[0].updatedAt.toISOString(),
		},
	]);
});
