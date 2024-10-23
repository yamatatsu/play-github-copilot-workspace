import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { showRoutes } from "hono/dev";
import root from "./routes/root";
import todosDelete from "./routes/todos/delete";
import todosPost from "./routes/todos/post";

const port = 3000;

const app = new OpenAPIHono({
	defaultHook: (result, c) => {
		if (!result.success) {
			return c.json({ errors: result.error.flatten() }, 400);
		}
	},
})
	.route("/", root)
	.route("/", todosDelete)
	.route("/", todosPost)
	.doc("/doc", {
		openapi: "3.0.0",
		info: { version: "1.0.0", title: "My API" },
	})
	.get("/ui", swaggerUI({ url: "/doc" }));

showRoutes(app, {
	verbose: true,
	colorize: true,
});

serve({ fetch: app.fetch, port }, () => {
	console.info(`Server is running on http://localhost:${port}`);
});
