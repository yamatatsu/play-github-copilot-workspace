import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
app.get("/", (c) => c.text("Hello Node.js!"));

const port = 3000;

serve({ fetch: app.fetch, port }, () => {
	console.info(`Server is running on http://localhost:${port}`);
});
