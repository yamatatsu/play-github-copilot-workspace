import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import logger from "@/middleware/logger";
import { Hono } from "hono";
import root from "./routes/root";
import taskDelete from "./routes/task-delete";
import taskList from "./routes/task-list";
import taskPost from "./routes/task-post";

export const app = new Hono()
	// The health check endpoint doesn't need authentication and any other middleware.
	.route("/", root)
	.use("/*", logger)
	.use("/*", cors)
	.use("/*", bearerAuth)
	.route("/", taskDelete)
	.route("/", taskPost)
	.route("/", taskList);
