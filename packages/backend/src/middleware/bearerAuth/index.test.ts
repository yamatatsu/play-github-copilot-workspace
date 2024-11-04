import { Hono } from "hono";
import { testClient } from "hono/testing";
import bearerAuth from "./";
import * as JwtVerifier from "./jwtVerifier";

const verifyJwtSpy = jest.spyOn(JwtVerifier, "verifyJwt");

const app = new Hono().use("/", bearerAuth).get("/", (c) => {
	return c.text("ok");
});
const client = testClient(app);

test("valid JWT", async () => {
	verifyJwtSpy.mockResolvedValueOnce({
		ok: true,
		payload: { sub: "test-sub" },
	});

	const res = await client.index.$get({
		header: { authorization: "Bearer test-jwt" },
	});

	expect(res.status).toBe(200);
	expect(await res.text()).toEqual("ok");
});

test("invalid JWT", async () => {
	verifyJwtSpy.mockResolvedValueOnce({ ok: false });

	const res = await client.index.$get({
		header: { authorization: "Bearer test-jwt" },
	});

	expect(res.status).toBe(401);
	expect(await res.json()).toEqual({
		code: "authorization_failed",
		message: "Unauthorized",
	});
});

// Non JWT cases
test.each`
	case                      | header                             | status | message
	${"no header"}            | ${undefined}                       | ${401} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"no header"}            | ${{}}                              | ${401} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"null"}                 | ${{ authorization: null }}         | ${400} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"empty string"}         | ${{ authorization: "" }}           | ${401} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"invalid string 'xxx'"} | ${{ authorization: "xxx" }}        | ${400} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"only 'Bearer'"}        | ${{ authorization: "Bearer" }}     | ${400} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"only 'Bearer '"}       | ${{ authorization: "Bearer " }}    | ${400} | ${{ code: "authorization_failed", message: "Unauthorized" }}
	${"lowercase 'bearer '"}  | ${{ authorization: "bearer xxx" }} | ${400} | ${{ code: "authorization_failed", message: "Unauthorized" }}
`("$case", async ({ header, status, message }) => {
	const res = await client.index.$get({ header });

	expect(res.status).toBe(status);
	expect(await res.json()).toEqual(message);
});
