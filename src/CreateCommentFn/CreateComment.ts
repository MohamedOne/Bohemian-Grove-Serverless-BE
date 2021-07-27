import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import User from "src/Global/User";
import {UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";
import Comment from "../Global/Comment";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    let postTimeStamp;
    let commentTimestamp = Date.now();

    if (event.body && event.pathParameters) {
        
        let body = event.body
        const incomingComm: any = JSON.parse(body);
        const incomingComment: Comment = new Comment(incomingComm);
        const temp = {
            timeStamp: incomingComment.timeStamp,
            userName: incomingComment.userName,
            body: incomingComment.body
        }
        console.log("Received comment: " + incomingComment);

        console.log("Received timestamp: " + event.pathParameters.timeStamp);
        postTimeStamp = event.pathParameters.timeStamp;

    const params: UpdateCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: postTimeStamp,
        },
        ExpressionAttributeNames: {
            "#c": "comments",
        },
        ExpressionAttributeValues : {
            ":nc": temp,
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
        console.log(err);
        return new HTTPResponse(400, "Unable to add comment");
        
    }

}
return new HTTPResponse(400, "Unable to add comment");
}
