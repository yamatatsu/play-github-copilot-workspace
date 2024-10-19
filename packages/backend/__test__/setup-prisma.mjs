jest.mock("../src/db", () => {
	return {
		prisma: jestPrisma.client,
	};
});
