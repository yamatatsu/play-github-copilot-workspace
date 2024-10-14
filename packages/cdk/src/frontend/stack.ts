import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

type Props = cdk.StackProps & {};
export class FrontendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: Props) {
		super(scope, id, props);

		const hostingBucket = new s3.Bucket(this, "Hosting", {
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			encryption: s3.BucketEncryption.S3_MANAGED,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		new BucketDeployment(this, "Deployment", {
			sources: [Source.asset("../frontend/dist")],
			destinationBucket: hostingBucket,
		});
	}
}
