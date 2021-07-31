import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    // Your code here
    if (event.pathParameters) {

        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            KeyConditionExpression: "dataType = :u",
            ExpressionAttributeValues: {
                ":s": {S: event.pathParameters.searchTerm || ''},
                ":u": {S: "user"}
            },
            FilterExpression: "contains(displayName, :s)"
        }

        const result = await ddbClient.send(new QueryCommand(params));

        return new HTTPResponse(200, result.Items);
    }
    return new HTTPResponse(400, "path params was null")
}