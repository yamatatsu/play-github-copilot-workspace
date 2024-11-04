import { prisma } from "@/db";
import { Hono } from "hono";
import { testClient } from "hono/testing";
import route from "./post";

const expectDate = expect.stringMatching(
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
);

// TODO: refactor as moving to a shared file
const app = new Hono()
	.use("/*", (c, next) => {
		c.set("jwtPayload", { sub: "test-user-sub" });
		return next();
	})
	.route("/", route);
const client = testClient(app);

test("response when 200", async () => {
	const res = await client.tasks.$post({
		header: { authorization: "Bearer xxx" },
		json: { title: "Buy milk", content: "Buy milk" },
	});

	expect(await res.json()).toEqual({
		id: expect.any(Number),
		title: "Buy milk",
		content: "Buy milk",
		done: false,
		createdBy: "test-user-sub",
		createdAt: expectDate,
		updatedAt: expectDate,
	});
});

test("new record when 200", async () => {
	const res = await client.tasks.$post({
		header: { authorization: "Bearer xxx" },
		json: { title: "Buy milk", content: "Buy milk" },
	});

	if (!res.ok) throw new Error(await res.text());

	const { id } = await res.json();

	const todo = await prisma.task.findUniqueOrThrow({
		where: { id },
	});

	expect(todo).toEqual({
		id: expect.any(Number),
		title: "Buy milk",
		content: "Buy milk",
		done: false,
		createdBy: "test-user-sub",
		createdAt: expect.anything(),
		updatedAt: expect.anything(),
	});
});

test("400", async () => {
	const res = await client.tasks.$post({
		header: { authorization: "Bearer xxx" },
		// @ts-expect-error
		json: {}, // empty
	});

	expect(await res.json()).toEqual({
		code: "schema_validation_failed",
		message: "Bad Request",
		errors: {
			fieldErrors: {
				title: ["Required"],
				content: ["Required"],
			},
			formErrors: [],
		},
	});
	expect(res.status).toEqual(400);
	expect(res.ok).toEqual(false);
});
