import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

const REPO_NAME = "yamatatsu/play-github-copilot-workspace";
const ISSUER = "token.actions.githubusercontent.com";

type Props = cdk.StackProps & {
	openIdConnectProviderArn: string;
};
export class DeploymentRoleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: Props) {
		super(scope, id, props);

		/**
		 * GitHub側で定義してくれているOIDC ProviderをAWS内に定義する。
		 */
		const oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
			this,
			"oidc-provider",
			props.openIdConnectProviderArn,
		);

		/**
		 * `cdk bootstrap` によって作成されるCDKデプロイ用のIAM Role
		 */
		const cdkBootstrappedRole = iam.Role.fromRoleName(
			this,
			"CdkBootstrappedRole",
			"cdk-hnb659fds-*",
		);

		/**
		 * GitHubのIdPを信頼するRole
		 * デプロイに必要な権限を持つ。
		 */
		new iam.Role(this, "deployment-role", {
			roleName: "gateway-cloud-cd-deployment-role",
			assumedBy: new iam.FederatedPrincipal(
				oidcProvider.openIdConnectProviderArn,
				{
					StringLike: { [`${ISSUER}:sub`]: `repo:${REPO_NAME}:*` },
				},
				"sts:AssumeRoleWithWebIdentity",
			),
			inlinePolicies: {
				// CDK deployに必要な権限
				cdkAssumeRole: new iam.PolicyDocument({
					statements: [
						new iam.PolicyStatement({
							actions: ["sts:AssumeRole"],
							resources: [cdkBootstrappedRole.roleArn],
						}),
					],
				}),
			},
		});
	}
}
