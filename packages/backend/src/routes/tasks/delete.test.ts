import { prisma } from "@/db";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import route from "./delete";

const app = new Hono().route("/", route);
const client = testClient(app);

test("delete TASK", async () => {
	// GIVEN
	const task = await prisma.task.create({
		data: {
			title: "Test TASK",
			content: "Test content",
			createdBy: "test-user",
		},
	});

	// WHEN
	const res = await client.tasks[":taskId"].$delete({
		header: { authorization: "Bearer xxx" },
		param: { taskId: task.id.toString() },
	});

	// THEN
	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ ok: true });

	const deletedTask = await prisma.task.findUnique({
		where: { id: task.id },
	});
	expect(deletedTask).toBeNull();
});
