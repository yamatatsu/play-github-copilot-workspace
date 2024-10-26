import type { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";
import { bearerAuth } from "hono/bearer-auth";
import { verifyJwt } from "./jwtVerifier";

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: CognitoJwtPayload;
	}
}

export default bearerAuth({
	verifyToken: async (token, c) => {
		const res = await verifyJwt(token);

		if (!res.ok) {
			return false;
		}

		c.set("jwtPayload", res.payload);

		return true;
	},
});
