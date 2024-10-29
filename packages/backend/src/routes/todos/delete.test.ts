import { prisma } from "@/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import route from "./delete";

const app = new OpenAPIHono().route("/", route);
const client = testClient(app);

test("delete TODO", async () => {
	// GIVEN
	const todo = await prisma.task.create({
		data: {
			title: "Test TODO",
			content: "Test content",
			createdBy: "test-user",
		},
	});

	// WHEN
	const res = await client.todos[":todoId"].$delete({
		param: { todoId: todo.id.toString() },
		header: { authorization: "" },
	});

	// THEN
	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ ok: true });

	const deletedTodo = await prisma.task.findUnique({
		where: { id: todo.id },
	});
	expect(deletedTodo).toBeNull();
});
