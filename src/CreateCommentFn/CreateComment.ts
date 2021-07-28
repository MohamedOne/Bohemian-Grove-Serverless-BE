import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import User from "src/Global/User";
import {UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";
import Comment from "../Global/Comment";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.body && event.pathParameters) {

        //Grab post timeStamp from path parameters
        let timeStamp = event.pathParameters.timeStamp;
        
        //Grab comment actual from request body
        let body = event.body
        const incomingComm: any = JSON.parse(body);
        const incomingComment: Comment = new Comment(incomingComm);
        
        //Add timestamp to our comment
        const pushThisComment = {
            displayName: incomingComment.displayName,
            displayImg: incomingComment.displayImg,
            comment: incomingComment.comment,
            commentStamp: Date.now(),
        }

        console.log("Received comment: " + JSON.stringify(pushThisComment));

        //Declare a temp array w/ our new comment to append to our comment array
        let tempArray = [];
        tempArray.push(pushThisComment);
        console.log(tempArray)


        //Now we append our single item list w/ the post's comment list
        const params: UpdateCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: timeStamp,
            },
            ExpressionAttributeValues : {
                ":newComment": tempArray,
            },
            UpdateExpression: 
                "SET comments = list_append(comments, :newComment)"
        }

 
        const data = await ddbDocClient.send(new UpdateCommand(params));
        return new HTTPResponse(200, data.Attributes);
    

}
return new HTTPResponse(400, "Unable to add comment");
}
