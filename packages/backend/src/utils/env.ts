const { NODE_ENV, JWT_ISSUER, JWT_AUDIENCE } = process.env;

if (!NODE_ENV) {
	throw new Error("NODE_ENV is required");
}
if (!JWT_ISSUER) {
	throw new Error("JWT_ISSUER is required");
}
if (!JWT_AUDIENCE) {
	throw new Error("JWT_AUDIENCE is required");
}

export default { NODE_ENV, JWT_ISSUER, JWT_AUDIENCE };
