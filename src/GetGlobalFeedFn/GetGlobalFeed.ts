import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";


export const handler = async (): Promise<HTTPResponse> => {
    // Your code here

    const params: QueryCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        ExpressionAttributeValues: {
            ":p": "post"
        },
        KeyConditionExpression: 'dataType = :p'

    }
    const data = await ddbDocClient.send(new QueryCommand(params));
    const feed = data.Items;
    return new HTTPResponse(200, feed);

}
