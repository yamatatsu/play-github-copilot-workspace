import { testClient } from "hono/testing";
import route from "./register";

describe("200", () => {
	test("json", async () => {
		// WHEN
		const res = await testClient(route).auth.register.$put({
			json: { name: "John" },
		});

		// THEN
		expect(await res.json()).toEqual({ ok: true });
	});

	test("db", async () => {
		// WHEN
		await testClient(route).auth.register.$put({
			json: { name: "John" },
		});

		// THEN
		const user = await jestPrisma.client.user.findUnique({
			where: { name: "John" },
		});
		expect(user).toEqual({ id: expect.any(Number), name: "John" });
	});
});

test("400", async () => {
	// WHEN
	const res = await testClient(route).auth.register.$put({
		// @ts-expect-error
		json: {},
	});

	// THEN
	expect(await res.json()).toEqual({
		details: {
			fieldErrors: {
				name: ["Required"],
			},
			formErrors: [],
		},
		message: "Bad Request",
	});
});
