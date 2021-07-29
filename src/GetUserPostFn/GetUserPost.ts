import { GetCommand, GetCommandInput, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from "../Global/Post";
import { HTTPResponse } from "../Global/DTO";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters) {

        const params: ScanCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            ExpressionAttributeValues: {
                ":type": "post",
                ":userName": event.pathParameters.userName,
            },
            FilterExpression: "dataType = :type AND userName = :userName"

        }
        const res = await ddbDocClient.send(new ScanCommand(params));
        console.log(res.Items);
        return new HTTPResponse(200, res.Items);

    }
    return new HTTPResponse(400, "path params was null");
}