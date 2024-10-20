import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BackendStack } from ".";

test("Snapshot test", () => {
	const app = new cdk.App();
	const stack = new BackendStack(app, "Target", {});

	const template = Template.fromStack(stack);
	expect(template.toJSON()).toMatchSnapshot();
});
