import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    const data = JSON.parse(event.body || '{}');

    if (data.isLiked == undefined || !data.userName || !data.timeStamp) return new HTTPResponse(400, {message: "Invalid input"});

    let operation;
    if (data.isLiked) operation = "DELETE";
    else operation = "ADD";

    const params: UpdateCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: data.timeStamp
        },
        ExpressionAttributeValues: {
            ":u": data.userName
        },
        UpdateExpression: `${operation} likes :u`
    }

    try {
        ddbDocClient.send(new UpdateCommand(params));
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, {message: "Failed to update database"});
    }

    return new HTTPResponse(200);
}