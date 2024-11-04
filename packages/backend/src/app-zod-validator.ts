import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import logger from "@/middleware/logger";
import { Hono } from "hono";
import root from "./routes-zod-validator/root";
import tasksDelete from "./routes-zod-validator/tasks/delete";
import tasksList from "./routes-zod-validator/tasks/list";
import tasksPost from "./routes-zod-validator/tasks/post";

export const app = new Hono()
	// The health check endpoint doesn't need authentication and any other middleware.
	.route("/", root)
	.use("/*", logger)
	.use("/*", cors)
	.use("/*", bearerAuth)
	.route("/", tasksDelete)
	.route("/", tasksPost)
	.route("/", tasksList);
