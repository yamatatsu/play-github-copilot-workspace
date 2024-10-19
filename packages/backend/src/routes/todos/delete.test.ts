import { testClient } from "hono/testing";
import route from "./delete";

test("test", async () => {
	const res = await testClient(route).todos[":todoId"].$delete({
		param: { todoId: "1212121" },
	});

	expect(await res.json()).toEqual({ ok: true });
});
