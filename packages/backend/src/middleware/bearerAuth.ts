import env from "@/utils/env";
import { bearerAuth } from "hono/bearer-auth";
import { type JWTPayload, createRemoteJWKSet, jwtVerify } from "jose";

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: JWTPayload;
	}
}

export default bearerAuth({
	verifyToken: async (token, c) => {
		// Allow health check
		if (c.req.path === "/" && c.req.method === "GET") {
			return true;
		}

		const JWKS = createRemoteJWKSet(
			new URL(`${env.JWT_ISSUER}/.well-known/jwks.json`),
		);
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: env.JWT_ISSUER,
			audience: env.JWT_AUDIENCE,
		});

		c.set("jwtPayload", payload);

		return true;
	},
});
