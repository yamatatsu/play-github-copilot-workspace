import * as cdk from "aws-cdk-lib";
import { aws_cognito as cognito } from "aws-cdk-lib";
import { Construct } from "constructs";

export class CognitoConstruct extends Construct {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const userPool = new cognito.UserPool(this, "UserPool", {
			accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
			signInAliases: { email: true },
			autoVerify: { email: true },
			selfSignUpEnabled: false,
			passwordPolicy: {
				minLength: 8,
				requireLowercase: false,
				requireDigits: false,
				requireSymbols: false,
				requireUppercase: false,
			},

			// Modify the below two lines if you deploy for production.
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			deletionProtection: false,
		});

		userPool.addClient("UserPoolClient", {
			authFlows: {
				userPassword: true,
				userSrp: true,
				custom: true,
			},
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
				},
				scopes: [
					cognito.OAuthScope.PROFILE,
					cognito.OAuthScope.PHONE,
					cognito.OAuthScope.EMAIL,
					cognito.OAuthScope.OPENID,
					cognito.OAuthScope.COGNITO_ADMIN,
				],
			},
			preventUserExistenceErrors: true,
		});
	}
}
