import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbClient } from "../Global/DynamoDB";
import Post from "../Global/Post";
import { HTTPResponse } from "../Global/DTO";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters) {

        const params: GetItemCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: {S: "post"},
                dataKey: {S: event.pathParameters.timeStamp || ''}
            }
        }
        const res = await ddbClient.send(new GetItemCommand(params));
        return new HTTPResponse(200, res.Item);

    }
    return new HTTPResponse(400, "path params was null");
}