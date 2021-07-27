import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";



export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    // Your code here

    if (event.pathParameters != null) {


        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,

            KeyConditionExpression: 'dataType = :p',
            ExpressionAttributeValues: {
                ":p": "post",
                ":s": event.pathParameters.userName
            },
            FilterExpression: "contains(userName, :s)"


        }
        const data = await ddbDocClient.send(new QueryCommand(params));
        const feed = data.Items;
        return new HTTPResponse(200, feed);
    }
    return new HTTPResponse(400, "path params was null");
}
