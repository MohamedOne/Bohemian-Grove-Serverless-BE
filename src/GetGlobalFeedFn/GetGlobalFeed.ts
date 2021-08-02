import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event) {

        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            ExpressionAttributeValues: {
                ":type": {S:"post"}
            },
            KeyConditionExpression: "dataType = :type",
            ScanIndexForward: false

        }
        const data = await ddbClient.send(new QueryCommand(params));
        const feed = data.Items;
        return new HTTPResponse(200, feed);

    }
    return new HTTPResponse(400, "Unable to grab feed")

}
