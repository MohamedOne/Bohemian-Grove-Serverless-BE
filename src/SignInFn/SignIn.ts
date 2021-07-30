import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../Global/DTO";
import cogClient from "../Global/Cognito";
import { InitiateAuthCommand, InitiateAuthCommandInput, InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    const data = JSON.parse(event.body || '{}');

    if (!data.userName || !data.password) return new HTTPResponse(400, {message: "Invalid input"});

    const cognitoParams: InitiateAuthCommandInput = {
        ClientId: process.env.COG_CLIENT_APPID,
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            USERNAME: data.userName,
            PASSWORD: data.password,
        }
    }

    let result: InitiateAuthCommandOutput;
    try {
        result = await cogClient.send(new InitiateAuthCommand(cognitoParams));
    } catch (err) {
        return new HTTPResponse(400, {message: "Failed to validate information"});
    }

    return new HTTPResponse(200, result.AuthenticationResult);
}