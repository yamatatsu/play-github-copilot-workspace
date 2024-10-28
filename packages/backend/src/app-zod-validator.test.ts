import { testClient } from "hono/testing";
import { app } from "./app";
import * as JwtVerifier from "./middleware/bearerAuth/jwtVerifier";

const verifyJwtSpy = jest.spyOn(JwtVerifier, "verifyJwt");

const client = testClient(app);

beforeEach(() => {
	jest.resetAllMocks();
});

test("health check", async () => {
	// @ts-expect-error
	const res = await client.index.$get();

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ message: "Hello Node.js!" });
});

test("400 caused by invalid authentication header", async () => {
	const res = await client.todos.$get({
		header: { authorization: "xxx" },
	});

	expect(res.status).toBe(400);
	expect(await res.json()).toEqual({
		code: "authorization_failed",
		message: "Unauthorized",
	});
});

test("401 caused by no authentication header", async () => {
	const res = await client.todos.$get({
		// @ts-expect-error
		header: {},
	});

	expect(res.status).toBe(401);
	expect(await res.json()).toEqual({
		code: "authorization_failed",
		message: "Unauthorized",
	});
});

test("401 caused by invalid token", async () => {
	// GIVEN
	verifyJwtSpy.mockReturnValue(Promise.resolve({ ok: false }));

	// WHEN
	const res = await client.todos.$get({
		header: { authorization: "Bearer xxx" },
	});

	// THEN
	expect(res.status).toBe(401);
	expect(await res.json()).toEqual({
		code: "authorization_failed",
		message: "Unauthorized",
	});
});
