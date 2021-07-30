import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";

const cogClient = new CognitoIdentityProviderClient({region: "us-east-2"});

export default cogClient;