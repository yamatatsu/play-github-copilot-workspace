jest.mock("@/db", () => {
	return {
		prisma: jestPrisma.client,
	};
});
