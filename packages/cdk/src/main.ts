import * as cdk from "aws-cdk-lib";
import { ENV_NAME, OPEN_ID_CONNECT_PROVIDER_ARN, STACK_ENV } from "./constants";
import { DeploymentRoleStack } from "./deployment-role/stack";
import { FrontendStack } from "./frontend/stack";

const prefix = `${ENV_NAME}PlayGithubCopilotWorkspace`;

const app = new cdk.App();

new DeploymentRoleStack(app, `${prefix}DeploymentRoleStack`, {
	openIdConnectProviderArn: OPEN_ID_CONNECT_PROVIDER_ARN,
	env: STACK_ENV,
});

new FrontendStack(app, `${prefix}FrontendStack`, {});
