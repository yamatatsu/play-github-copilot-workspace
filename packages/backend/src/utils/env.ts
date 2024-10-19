const { NODE_ENV, JWT_SECRET } = process.env;
if (!NODE_ENV) {
	throw new Error("NODE_ENV is required");
}
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET is required");
}
export default { NODE_ENV, JWT_SECRET };
