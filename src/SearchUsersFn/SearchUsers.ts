import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {QueryCommandInput, QueryCommand} from "@aws-sdk/lib-dynamodb";
import Post from "../Global/Post";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    
    //Endpoint passed is GET ../post/{userName}
    if (event.pathParameters) {
        console.log("Received userName: " + event.pathParameters.userName);
        let userName = event.pathParameters.userName;


        //Grab all posts filtering by username of requested user
        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            ExpressionAttributeValues: {
                ":p": "post",
                ":user": userName
            },
            KeyConditionExpression: 'dataType = :p',
            FilterExpression: "userName = :user"
    
        }
        let userPosts: Post[] = [];
        try {
            const data = await ddbDocClient.send(new QueryCommand(params));
            userPosts = data.Items as Post[];
            return new HTTPResponse(200, userPosts);
        } catch (err) {
            return new HTTPResponse(400, "Unable to get user's posts")            
        }
    }
    return new HTTPResponse(400, "Unable to get user's posts")
}
