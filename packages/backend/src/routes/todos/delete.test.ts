import { prisma } from "@/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import route from "./delete";

const app = new OpenAPIHono().route("/", route);
const client = testClient(app);

test("delete TODO", async () => {
	// Create a TODO to delete
	const todo = await prisma.todo.create({
		data: {
			title: "Test TODO",
			content: "Test content",
			createdBy: "test-user",
		},
	});

	// Delete the TODO
	const res = await client.todos[":todoId"].$delete({
		param: { todoId: todo.id.toString() },
	});

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ ok: true });

	// Verify the TODO is deleted
	const deletedTodo = await prisma.todo.findUnique({
		where: { id: todo.id },
	});
	expect(deletedTodo).toBeNull();
});
