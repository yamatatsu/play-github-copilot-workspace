import { prisma } from "@/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import route from "./delete";

const app = new OpenAPIHono().route("/", route);
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
		param: { taskId: task.id.toString() },
		header: { authorization: "" },
	});

	// THEN
	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ ok: true });

	const deletedTask = await prisma.task.findUnique({
		where: { id: task.id },
	});
	expect(deletedTask).toBeNull();
});
