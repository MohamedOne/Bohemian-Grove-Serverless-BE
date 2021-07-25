import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import User from "src/Global/User";
import {UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    // Your code here

    let comment;
    let timestamp;
    let commentTimestamp = Date.now();

    if (event.body) {
        
        let body = JSON.parse(event.body)
        console.log("Received comment: " + body.comment);
        comment = body.comment;
        comment.timestamp = commentTimestamp;
    }

    if (event.pathParameters ) {
        console.log("Received timestamp: " + event.pathParameters.postId);
        timestamp = event.pathParameters.postId;
    }

    const params: UpdateCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: timestamp,
        },
        ExpressionAttributeNames: {
            "#c": "comments",
        },
        ExpressionAttributeValues : {
            ":nc": comment,
        },
        UpdateExpression: 
            "SET #c = list_append(#c, :nc)"
        ,
        ReturnValues: "UPDATED_NEW"
    }

    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));

        return new HTTPResponse(200, data.Attributes);
    } catch (err) {
        return new HTTPResponse(400, "Unable to add comment");
        
    }


   
}
