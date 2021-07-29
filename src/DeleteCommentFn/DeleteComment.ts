import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { GetCommand, GetCommandInput, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if(event && event.pathParameters) {

        //Pull timeStamp of post and target commentStamp off of pathParameters
        console.log("Here are the path parameters: " + event.pathParameters.timeStamp, 
            event.pathParameters.commentStamp);
            let timeStamp = event.pathParameters.timeStamp;
            let commentStamp = event.pathParameters.commentStamp;


            //Initial query to get comment array (object array...)
            const getCommentParams: GetCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
                Key: {
                    dataType : "post",
                    dataKey : timeStamp
                },
                ProjectionExpression: "comments"
            }

            //Initial step--> Grab comment array off of post
            const resultQuery = await ddbDocClient.send(new GetCommand(getCommentParams));

            let temp = resultQuery.Item
            console.log(temp?.comments)
            let commentsArray = temp?.comments;

            //Next --> iterate over array to find target comment
            let index = 0;
            for(let i = 0; i < commentsArray.length; i++) {
                if(commentsArray[i].commentStamp == commentStamp)
                    index = i;
            }
            console.log(index);

            //Finally --> remove target comment by referencing index
            const removeCommentParams: UpdateCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
                Key: {
                    dataType: "post",
                    dataKey: timeStamp
                },
                UpdateExpression: `REMOVE comments[${index}]`,
                ReturnValues: "ALL_NEW"
            }
            const removeQuery = await ddbDocClient.send(new UpdateCommand(removeCommentParams));
       
            //Return new comment array sin deleted comment
            return new HTTPResponse(200, removeQuery.Attributes);
    }
    return new HTTPResponse(400, "Unable to delete comment");
}
