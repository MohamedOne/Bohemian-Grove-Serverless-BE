import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";



export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    
    // Parse data
    if (!event.pathParameters) return new HTTPResponse(400, {message: "Invalid input"});

    // Query dynamo
    const params: QueryCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        KeyConditionExpression: 'dataType = :p',
        ExpressionAttributeValues: {
            ":p": {S: "post"},
            ":s": {S: event.pathParameters.userName || ' '}
        },
        FilterExpression: "userName = :s"


    }
    
    let data;
    try {
        data = await ddbClient.send(new QueryCommand(params));
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, "Database query failed");
    }

    // Return success
    const feed = data.Items;
    return new HTTPResponse(200, feed);
}
