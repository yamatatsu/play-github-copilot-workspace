import { OpenAPIHono } from "@hono/zod-openapi";
import { testClient } from "hono/testing";
import bearerAuth from "./";
import * as JwtVerifier from "./jwtVerifier";

const verifyJwtSpy = jest.spyOn(JwtVerifier, "verifyJwt");

const app = new OpenAPIHono().use("/", bearerAuth).get("/", (c) => {
	return c.text("ok");
});
const client = testClient(app);

test("valid JWT", async () => {
	verifyJwtSpy.mockResolvedValueOnce({
		ok: true,
		payload: {
			sub: "test-sub",
			token_use: "id",
			iss: "",
			exp: 0,
			iat: 0,
			auth_time: 0,
			jti: "",
			origin_jti: "",
		},
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
	expect(await res.text()).toEqual("Unauthorized");
});

// Non JWT cases
test.each`
	case                      | header                             | status | message
	${"no header"}            | ${undefined}                       | ${401} | ${"Unauthorized"}
	${"no header"}            | ${{}}                              | ${401} | ${"Unauthorized"}
	${"null"}                 | ${{ authorization: null }}         | ${400} | ${"Bad Request"}
	${"empty string"}         | ${{ authorization: "" }}           | ${401} | ${"Unauthorized"}
	${"invalid string 'xxx'"} | ${{ authorization: "xxx" }}        | ${400} | ${"Bad Request"}
	${"only 'Bearer'"}        | ${{ authorization: "Bearer" }}     | ${400} | ${"Bad Request"}
	${"only 'Bearer '"}       | ${{ authorization: "Bearer " }}    | ${400} | ${"Bad Request"}
	${"lowercase 'bearer '"}  | ${{ authorization: "bearer xxx" }} | ${400} | ${"Bad Request"}
`("$case", async ({ header, status, message }) => {
	const res = await client.index.$get({ header });

	expect(res.status).toBe(status);
	expect(await res.text()).toEqual(message);
});
