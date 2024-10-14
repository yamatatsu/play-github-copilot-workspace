import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { expect, test } from "vitest";
import { FrontendStack } from "./stack";

test("Snapshot test", () => {
	const app = new cdk.App();

	const stack = new FrontendStack(app, "Target", {});

	const template = Template.fromStack(stack);
	expect(template.toJSON()).toMatchSnapshot();
});
