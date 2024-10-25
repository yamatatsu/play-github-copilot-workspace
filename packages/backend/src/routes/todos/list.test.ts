import { prisma } from "@/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import route from "./list";

const app = new OpenAPIHono().route("/", route);
const client = testClient(app);

test("response when 200", async () => {
	const todos = [
		{ id: 1, title: "Test TODO 1", content: "Content 1", done: false, createdBy: "user1", createdAt: new Date(), updatedAt: new Date() },
		{ id: 2, title: "Test TODO 2", content: "Content 2", done: false, createdBy: "user2", createdAt: new Date(), updatedAt: new Date() },
	];

	prisma

	const res = await client.todos.$get();

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual(todos);
});
