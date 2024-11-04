import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import logger from "@/middleware/logger";
import { Hono } from "hono";
import root from "./routes/root";
import tasksDelete from "./routes/tasks/delete";
import tasksList from "./routes/tasks/list";
import tasksPost from "./routes/tasks/post";

export const app = new Hono()
	// The health check endpoint doesn't need authentication and any other middleware.
	.route("/", root)
	.use("/*", logger)
	.use("/*", cors)
	.use("/*", bearerAuth)
	.route("/", tasksDelete)
	.route("/", tasksPost)
	.route("/", tasksList);
