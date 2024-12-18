import { prisma } from "@/db";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import route from "./task-put";

const app = new Hono().route("/", route);
const client = testClient(app);

test("update task", async () => {
	// GIVEN
	const task = await prisma.task.create({
		data: {
			title: "Test Task",
			content: "Test content",
			createdBy: "test-user",
		},
	});

	// WHEN
	const res = await client.tasks[":taskId"].$put({
		header: { authorization: "Bearer xxx" },
		param: { taskId: task.id.toString() },
		json: { title: "Updated Task", content: "Updated content", done: true },
	});

	// THEN
	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({
		...task,
		title: "Updated Task",
		content: "Updated content",
		done: true,
		createdAt: task.createdAt.toISOString(),
		updatedAt: expect.any(String),
	});

	const updatedTask = await prisma.task.findUnique({
		where: { id: task.id },
	});
	expect(updatedTask).toEqual(
		expect.objectContaining({
			title: "Updated Task",
			content: "Updated content",
			done: true,
		}),
	);
});

test("invalid request body", async () => {
	// GIVEN
	const task = await prisma.task.create({
		data: {
			title: "Test Task",
			content: "Test content",
			createdBy: "test-user",
		},
	});

	// WHEN
	const res = await client.tasks[":taskId"].$put({
		header: { authorization: "Bearer xxx" },
		param: { taskId: task.id.toString() },
		// @ts-expect-error
		json: { done: "invalid" },
	});

	// THEN
	expect(res.status).toBe(400);
	expect(await res.json()).toEqual({
		code: "schema_validation_failed",
		message: "Bad Request",
		errors: {
			fieldErrors: {
				title: ["Required"],
				content: ["Required"],
				done: ["Expected boolean, received string"],
			},
			formErrors: [],
		},
	});
});
