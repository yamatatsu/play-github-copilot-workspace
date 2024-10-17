import { testClient } from "hono/testing";
import { expect, test } from "vitest";
import route from "./root";

test("test", async () => {
	const res = await testClient(route).index.$get();

	expect(await res.json()).toEqual({ message: "Hello Node.js!" });
});
