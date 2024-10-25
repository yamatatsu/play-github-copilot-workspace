import { serve } from "@hono/node-server";
import { showRoutes } from "hono/dev";
import { app } from "./app";

const port = 3000;

showRoutes(app, {
	verbose: true,
	colorize: true,
});

serve({ fetch: app.fetch, port }, () => {
	console.info(`Server is running on http://localhost:${port}`);
});
