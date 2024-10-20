import * as cdk from "aws-cdk-lib";
import { BackendStack } from "./backend-stack";
import { DeployRoleStack } from "./deploy-role-stack";
import params from "./params";

const app = new cdk.App();

new DeployRoleStack(app, `${params.prefix}-deploy-role`, {
	env: params.env,
});

new BackendStack(app, `${params.prefix}-backend`, {
	env: params.env,
});
