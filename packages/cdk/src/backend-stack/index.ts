import * as cdk from "aws-cdk-lib";
import type { Construct } from "constructs";
import { CognitoConstruct } from "./construct/cognito";

interface Props extends cdk.StackProps {}
export class BackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: Props) {
		super(scope, id, props);

		new CognitoConstruct(this, "Cognito");
	}
}
