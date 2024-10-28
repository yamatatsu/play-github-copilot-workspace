import bearerAuth from "@/middleware/bearerAuth";
import cors from "@/middleware/cors";
import logger from "@/middleware/logger";
import { Hono } from "hono";
import root from "./routes-zod-validator/root";
import todosDelete from "./routes-zod-validator/todos/delete";
import todosList from "./routes-zod-validator/todos/list";
import todosPost from "./routes-zod-validator/todos/post";

export const app = new Hono()
	// The health check endpoint doesn't need authentication and any other middleware.
	.route("/", root)
	.use("/*", logger)
	.use("/*", cors)
	.use("/*", bearerAuth)
	.route("/", todosDelete)
	.route("/", todosPost)
	.route("/", todosList);
