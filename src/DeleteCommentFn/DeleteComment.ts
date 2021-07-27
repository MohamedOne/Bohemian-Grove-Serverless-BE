import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import { GetCommand, GetCommandInput, QueryCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import Post from "src/Global/Post";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters && event.body) {

        //Take timestamp (dataKey) from path parameters --> dataKey of post named postId?
        console.log("Received timeStamp: " + event.pathParameters.timeStamp);
        let timeStamp = event.pathParameters.timeStamp;

        //Take comment body from event.body
        let body = JSON.parse(event.body)
        let comment: string = body.comment 

        //Grab comment array
        const queryParams: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: "123"
            }
            
        }

        //Iterate over array to find index of element to be removed 
        const resultOfQuery = await ddbDocClient.send(new GetCommand(queryParams));
        const resultChecker = new HTTPResponse(200, resultOfQuery.Item)
        let tempPost: any = resultChecker.body;
        console.log(tempPost);
        let commentArray = tempPost.comments; 
        let index = 0;
        for(let i = 0; i < commentArray.length; i++) {
            if(commentArray[i] === comment) {
                index = i;
            }
        }
        
        //Second call to AWS client to remove comment
        const params: UpdateCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: timeStamp
            },
            UpdateExpression: "REMOVE comments[:index]",
            ExpressionAttributeValues: {
                ":comment" : comment,
                ":index" : index
            }
        }

        try {
            //Delete requested user
            const result = await ddbDocClient.send(new UpdateCommand(params));
            return new HTTPResponse(200, result.Attributes);
        } catch (err) {
            return new HTTPResponse(400, "Unable to delete comment");  
    }
    }   

    //Default response if we can't grab user
    return new HTTPResponse(400, "Unable to delete comment");
   

}
