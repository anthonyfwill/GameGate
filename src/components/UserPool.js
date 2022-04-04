import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
	UserPoolId: "us-east-1_hWhzBDves",
	ClientId: "4bihl57dd69s099uhp3alaj649"
}

export default new CognitoUserPool(poolData);
