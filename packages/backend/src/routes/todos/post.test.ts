import { testClient } from "hono/testing";
import route from "./post";

test("200", async () => {
	const res = await testClient(route).todos.$post({
		json: { title: "Buy milk" },
	});

	expect(await res.json()).toEqual({ id: "123", title: "Buy milk" });
});

test("400", async () => {
	const res = await testClient(route).todos.$post({
		// @ts-expect-error
		json: {}, // empty
	});

	expect(await res.json()).toEqual({
		message: "Bad Request",
		details: {
			fieldErrors: { title: ["Required"] },
			formErrors: [],
		},
	});
	expect(res.status).toEqual(400);
	expect(res.ok).toEqual(false);
});
