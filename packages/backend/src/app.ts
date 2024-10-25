import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import root from "./routes/root";
import todosDelete from "./routes/todos/delete";
import todosPost from "./routes/todos/post";
import todosList from "./routes/todos/list";

const _app = new OpenAPIHono({
	defaultHook: (result, c) => {
		if (!result.success) {
			return c.json({ errors: result.error.flatten() }, 400);
		}
	},
});

_app.use("/*", cors);
_app.use("/*", bearerAuth);

export const app = _app
	.route("/", root)
	.route("/", todosDelete)
	.route("/", todosPost)
	.route("/", todosList)
	.doc("/doc", {
		openapi: "3.0.0",
		info: { version: "1.0.0", title: "My API" },
	})
	.get("/ui", swaggerUI({ url: "/doc" }));
