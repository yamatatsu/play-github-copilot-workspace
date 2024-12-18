import { logger } from "@/utils/logger";
import { bearerAuth } from "hono/bearer-auth";
import { type Payload, verifyJwt } from "./jwtVerifier";

declare module "hono" {
	interface ContextVariableMap {
		jwtPayload: Payload;
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
	/**
	 * We should not describe the detail of the error message.
	 * Because any attacker will meet it.
	 * This message will return with status code 401.
	 * We will not meet this error usually, because we will use RPC.
	 */
	noAuthenticationHeaderMessage: () => {
		logger.info("No authentication header");

		return { code: "authorization_failed", message: "Unauthorized" };
	},
	invalidAuthenticationHeaderMessage: () => {
		logger.info("Invalid authentication header");

		return { code: "authorization_failed", message: "Unauthorized" };
	},
	invalidTokenMessage: () => {
		logger.info("Invalid token");

		return { code: "authorization_failed", message: "Unauthorized" };
	},
});
