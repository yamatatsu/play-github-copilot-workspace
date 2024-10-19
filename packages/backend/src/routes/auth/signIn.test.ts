import { decode } from "hono/jwt";
import { testClient } from "hono/testing";
import route from "./signIn";

describe("200", async () => {
	const res = await testClient(route).auth.register.$put({
		json: { name: "John" },
	});

	test("cookie", () => {
		const cookie = res.headers.get("set-cookie");
		expect(cookie).toEqual(expect.stringContaining("HttpOnly;"));
		expect(cookie).toEqual(expect.stringContaining("Secure; SameSite=Strict"));
		expect(cookie).toEqual(expect.stringContaining("SameSite=Strict"));

		const jwt = cookie?.match(/token=([\d\w.]+);/)?.[1];

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const jwtContent = decode(jwt!);

		expect(jwtContent).toEqual({
			header: {
				alg: "HS256",
				typ: "JWT",
			},
			payload: {
				aud: "https://github.com/yamatatsu/play-github-copilot-workspace",
				iss: "https://github.com/yamatatsu/play-github-copilot-workspace",
				name: "John",
			},
		});
	});

	test("json", async () => {
		expect(await res.json()).toEqual({ ok: true });
	});
});

test("200", async () => {
	const res = await testClient(route).auth.register.$put({
		// @ts-expect-error
		json: {},
	});

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
