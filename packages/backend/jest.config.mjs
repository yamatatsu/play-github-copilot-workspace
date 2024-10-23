/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: "@quramy/jest-prisma-node/environment",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	setupFilesAfterEnv: ["<rootDir>/__test__/setup-prisma.mjs"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
};
