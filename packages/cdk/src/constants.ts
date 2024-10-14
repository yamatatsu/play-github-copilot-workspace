import type * as cdk from "aws-cdk-lib";

const envNames = ["prd"] as const;
type EnvName = (typeof envNames)[number];
export const ENV_NAME = (process.env.ENV_NAME as EnvName) ?? "prd";
if (!envNames.includes(ENV_NAME)) {
	throw new Error(`ENV_NAME must be in ${envNames.toString()}`);
}

export const STACK_ENV: cdk.Environment = {
	prd: {
		account: "660782280015",
		region: "ap-northeast-1",
	},
}[ENV_NAME];

export const OPEN_ID_CONNECT_PROVIDER_ARN: string = {
	prd: "arn:aws:iam::660782280015:oidc-provider/token.actions.githubusercontent.com",
}[ENV_NAME];
