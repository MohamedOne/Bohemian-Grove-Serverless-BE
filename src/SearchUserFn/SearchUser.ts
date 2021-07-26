import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    // Your code here
    if (event.pathParameters) {

        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            KeyConditionExpression: "dataType = :u",
            ExpressionAttributeValues: {
                ":s": event.pathParameters.displayName,
                ":u": "user"
            },
            FilterExpression: "contains(displayName, :s)"
        }

        const result = await ddbDocClient.send(new QueryCommand(params));
        return new HTTPResponse(200, result.Items);
    }
    return new HTTPResponse(400, "path params was null")
}