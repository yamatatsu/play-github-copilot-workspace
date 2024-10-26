import env from "@/utils/env";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { JwtExpiredError } from "aws-jwt-verify/error";
import type { CognitoJwtPayload } from "aws-jwt-verify/jwt-model";

const verifier = CognitoJwtVerifier.create({
	userPoolId: env.USER_POOL_ID,
	clientId: env.USER_POOL_CLIENT_ID,
	tokenUse: null, // allow both access and id tokens
});

type Response = { ok: true; payload: CognitoJwtPayload } | { ok: false };

export async function verifyJwt(token: string): Promise<Response> {
	try {
		const payload = await verifier.verify(token);

		return { ok: true, payload };
	} catch (err) {
		if (err instanceof JwtExpiredError) {
			return { ok: false };
		}
		throw err;
	}
}
