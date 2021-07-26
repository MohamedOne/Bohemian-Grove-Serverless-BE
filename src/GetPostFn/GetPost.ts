import { GetCommand, GetCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from "../Global/Post";
import { HTTPResponse } from "../Global/DTO";



export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.body != null) {
        const postId = JSON.parse(event.body);

        const params: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: String(postId)
            }
        }
        console.log(params);
        const res = await ddbDocClient.send(new GetCommand(params));
        return new HTTPResponse(200, res.Item);

    }
    return new HTTPResponse(400, "body was null");
}