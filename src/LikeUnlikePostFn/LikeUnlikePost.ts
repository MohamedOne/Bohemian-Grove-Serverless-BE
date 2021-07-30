import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import { UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    const data = JSON.parse(event.body || '{}');

    console.log(data);

    if (data.isLiked == undefined || !data.userName || !data.timeStamp) return new HTTPResponse(400, {message: "Invalid input"});

    let operation;
    if (data.isLiked) operation = "DELETE";
    else operation = "ADD";

    const params: UpdateItemCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: {S: "post"},
            dataKey: {S: data.timeStamp}
        },
        ExpressionAttributeValues: {
            ":u": {SS: [data.userName]}
        },
        UpdateExpression: `${operation} likes :u`
    }

    try {
        ddbClient.send(new UpdateItemCommand(params));
    } catch (err) {
        console.log(err);
        return new HTTPResponse(500, {message: "Failed to update database"});
    }

    return new HTTPResponse(200);
}