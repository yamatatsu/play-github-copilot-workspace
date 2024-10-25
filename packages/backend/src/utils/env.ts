const { JWT_ISSUER, JWT_AUDIENCE } = process.env;

if (!JWT_ISSUER) {
	throw new Error("JWT_ISSUER is required");
}
if (!JWT_AUDIENCE) {
	throw new Error("JWT_AUDIENCE is required");
}

export default { JWT_ISSUER, JWT_AUDIENCE };
