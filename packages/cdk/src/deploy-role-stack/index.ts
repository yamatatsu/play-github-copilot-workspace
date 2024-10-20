import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";
import params from "../params";

const OWNER = "yamatatsu";
const REPO = "play-github-copilot-workspace";
const FILTER = "*";

const IAM_REPO_DEPLOY_ACCESS = `repo:${OWNER}/${REPO}:${FILTER ?? "*"}`;

interface Props extends cdk.StackProps {}
export class DeployRoleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: Props) {
		super(scope, id, props);

		const githubDomain = "https://token.actions.githubusercontent.com";

		const githubProvider = new iam.OpenIdConnectProvider(
			this,
			"GithubActionsProvider",
			{
				url: githubDomain,
				clientIds: ["sts.amazonaws.com"],
			},
		);

		new iam.Role(this, "gitHubDeployRole", {
			assumedBy: new iam.WebIdentityPrincipal(
				githubProvider.openIdConnectProviderArn,
				{
					StringLike: {
						"token.actions.githubusercontent.com:sub": IAM_REPO_DEPLOY_ACCESS,
						"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
					},
				},
			),
			managedPolicies: [
				iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
			],
			roleName: `${params.prefix}-assume-role`,
			description:
				"This role is used via GitHub Actions to deploy with AWS CDK or Terraform on the target AWS account",
			maxSessionDuration: cdk.Duration.hours(12),
		});
	}
}
