import { testClient } from "hono/testing";
import { app } from "./app";

const client = testClient(app);

test("valid JWT", async () => {
	// @ts-expect-error
	const res = await client.index.$get();

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({ message: "Hello Node.js!" });
});
