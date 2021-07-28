import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {PutCommand, PutCommandInput} from "@aws-sdk/lib-dynamodb";
import Post from "../Global/Post";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    //Check if we have event body and specifically if we have a username in event
    if(event.body && event.requestContext.authorizer) {
        let body = event.body;
        const post: any = JSON.parse(body);
        const newPost: Post = new Post(post);

        //Check username in incoming post body against username in { event.requestContext.authorizer.claims.username }
        if(newPost.userName === event.requestContext.authorizer.claims.username) {
            //Proceed with adding new post 
            const params: PutCommandInput = {
                TableName: process.env.DDB_Table_Name, 

                Item: {
                    dataKey: `${newPost.timeStamp}`,
                    dataType : "post",
                    displayName: `${newPost.displayName}`,
                    userName: `${newPost.userName}`,
                    displayImg: `${newPost.displayImg}`,
                    postBody: `${newPost.postBody}`,
                    likes: `${newPost.likes}`,
                    timeStamp: `${newPost.timeStamp}`,
                    comments: `${newPost.comments}`,
                    postImg: `${newPost.postImg}`,
                },
                ReturnValues: "ALL_OLD"
            }
        
        
                const data = await ddbDocClient.send(new PutCommand(params));
                return new HTTPResponse(200, "Post added successfully", data.Attributes);
            
        
        } 

    } 
        return new HTTPResponse(400, "Unable to add post", "most outer if-else");

    
}