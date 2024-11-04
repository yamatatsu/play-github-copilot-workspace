import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import logger from "@/middleware/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import root from "./routes/root";
import tasksDelete from "./routes/tasks/delete";
import tasksList from "./routes/tasks/list";
import tasksPost from "./routes/tasks/post";

const _app = new OpenAPIHono();

// The health check endpoint doesn't need authentication and any other middleware.
_app.route("/", root);

_app.use("/*", logger);
_app.use("/*", cors);
_app.use("/*", bearerAuth);

export const app = _app
	.route("/", tasksDelete)
	.route("/", tasksPost)
	.route("/", tasksList)
	.doc("/doc", {
		openapi: "3.0.0",
		info: { version: "1.0.0", title: "My API" },
	})
	.get("/ui", swaggerUI({ url: "/doc" }));
