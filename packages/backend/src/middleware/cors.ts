import { cors } from "hono/cors";

export default cors({
	origin: "http://localhost:5173",
	// allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
	// allowMethods: ["POST", "GET", "OPTIONS"],
	// exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
	// maxAge: 600,
	// credentials: true,
});
