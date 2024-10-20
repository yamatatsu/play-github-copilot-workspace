import type { Environment } from "aws-cdk-lib";

const { ENV_NAME = "dev" } = process.env;
if (!ENV_NAME) {
	throw new Error("ENV_NAME is required");
}
if (ENV_NAME !== "dev" && ENV_NAME !== "prd") {
	throw new Error("ENV_NAME must be dev or prd");
}

const PROJECT_NAME = "PGCW";
const prefix = `${ENV_NAME}-${PROJECT_NAME}`;

type Params = {
	env: Environment;
	envName: "dev" | "prd";
	prefix: string;
};

const envParamsDict = {
	dev: {
		env: { account: "660782280015", region: "ap-northeast-1" },
		envName: ENV_NAME,
		prefix,
	},
	prd: {
		env: { account: "660782280015", region: "ap-northeast-1" },
		envName: ENV_NAME,
		prefix,
	},
} satisfies Record<typeof ENV_NAME, Params>;

export default envParamsDict[ENV_NAME];
