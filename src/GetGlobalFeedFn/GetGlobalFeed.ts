import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { GetCommand, GetCommandInput, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event) {

        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            ExpressionAttributeValues: {
                ":type": "post"
            },
            KeyConditionExpression: "dataType = :type",
            ScanIndexForward: false

        }
        const data = await ddbDocClient.send(new QueryCommand(params));
        const feed = data.Items;
        return new HTTPResponse(200, feed);

    }
    return new HTTPResponse(400, "Unable to grab feed")

}
