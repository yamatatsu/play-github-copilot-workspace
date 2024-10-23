import { testClient } from "hono/testing";
import { prisma } from "../../db";
import route from "./post";

const expectDate = expect.stringMatching(
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
);

test("response when 200", async () => {
	const res = await testClient(route).todos.$post({
		json: { title: "Buy milk" },
	});

	expect(await res.json()).toEqual({
		id: expect.any(Number),
		title: "Buy milk",
		content: "test-content",
		done: false,
		createdBy: "test-user",
		createdAt: expectDate,
		updatedAt: expectDate,
	});
});

test("new record when 200", async () => {
	const res = await testClient(route).todos.$post({
		json: { title: "Buy milk" },
	});

	if (!res.ok) throw new Error(await res.text());

	const { id } = await res.json();

	const todo = await prisma.todo.findUniqueOrThrow({
		where: { id },
	});

	expect(todo).toEqual({
		id: expect.any(Number),
		title: "Buy milk",
		content: "test-content",
		done: false,
		createdBy: "test-user",
		createdAt: expect.anything(),
		updatedAt: expect.anything(),
	});
});

test("400", async () => {
	const res = await testClient(route).todos.$post({
		// @ts-expect-error
		json: {}, // empty
	});

	expect(await res.json()).toEqual({
		success: false,
		error: {
			name: "ZodError",
			issues: [
				{
					code: "invalid_type",
					expected: "string",
					message: "Required",
					path: ["title"],
					received: "undefined",
				},
			],
		},
	});
	expect(res.status).toEqual(400);
	expect(res.ok).toEqual(false);
});
