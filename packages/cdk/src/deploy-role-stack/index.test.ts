import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DeployRoleStack } from ".";

test("Snapshot test", () => {
	const app = new cdk.App();
	const stack = new DeployRoleStack(app, "Target", {});

	const template = Template.fromStack(stack);
	expect(template.toJSON()).toMatchSnapshot();
});
