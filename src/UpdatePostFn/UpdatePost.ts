import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {DeleteCommand, DeleteCommandInput, UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";
import Post from "../Global/Post";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters && event.body) {
        console.log(event.pathParameters);
        //Take timestamp key from path parameters
        console.log("Received timeStamp: " + event.pathParameters.timeStamp);
        let timeStamp = event.pathParameters.timeStamp;

        //Get new postBody from { event.body }
        let body = event.body;
        const post: any = JSON.parse(body);
        const incomingPost: Post = new Post(post);
        let postBody = incomingPost.postBody;


        const params: UpdateCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: timeStamp
            },
            ExpressionAttributeValues: {
                ":pb": postBody,
            },
            UpdateExpression: "SET postBody = :pb",
            ReturnValues: "ALL_NEW"
        }

        try {
            //Update requested post
            const data = await ddbDocClient.send(new UpdateCommand(params));
            return new HTTPResponse(200, data.Attributes);
        } catch (err) {
            return new HTTPResponse(400, "Unable to update post");  
    }
    }   

    //Default response if we can't update post
    return new HTTPResponse(400, "Unable to update post");

}
