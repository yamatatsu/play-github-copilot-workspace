import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { expect, test } from "vitest";
import { DeploymentRoleStack } from "./stack";

test("Snapshot test", () => {
	const app = new cdk.App();

	const stack = new DeploymentRoleStack(app, "Target", {
		openIdConnectProviderArn:
			"arn:aws:iam:123456789012:ap-northeast-1:oidc-provider:bar",
	});

	const template = Template.fromStack(stack);
	expect(template.toJSON()).toMatchSnapshot();
});
