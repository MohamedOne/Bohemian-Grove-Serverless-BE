import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../Global/DTO";
import cogClient from "../Global/Cognito";
import { SignUpCommand, SignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    const data = JSON.parse(event.body || '{}');

    if (!data.userName || !data.password || !data.email) return new HTTPResponse(400, {message: "Invalid input", data});

    const cognitoParams: SignUpCommandInput = {
        ClientId: process.env.COG_CLIENT_APPID,
        Username: data.userName,
        Password: data.password,
        UserAttributes: [
            {
                Name: 'email',
                Value: data.email
            }
        ]
    }

    try {
        const result = await cogClient.send(new SignUpCommand(cognitoParams));
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, {message: "Failed to create user"});
    }

    return new HTTPResponse(201);
}