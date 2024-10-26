const { USER_POOL_ID, USER_POOL_CLIENT_ID } = process.env;

if (!USER_POOL_ID) {
	throw new Error("USER_POOL_ID is required");
}
if (!USER_POOL_CLIENT_ID) {
	throw new Error("USER_POOL_CLIENT_ID is required");
}

export default { USER_POOL_ID, USER_POOL_CLIENT_ID };
