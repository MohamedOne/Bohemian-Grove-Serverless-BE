import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import Post from "../Global/Post";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    //Check if we have event body and specifically if we have a username in event
    if(event.body ) {
        let body = event.body;
        const post: any = JSON.parse(body);
        const newPost: Post = new Post(post);

        let temp = Date.now();
        let timeStamp = temp.toString();

        //Check username in incoming post body against username in { event.requestContext.authorizer.claims.username }
        
        //Proceed with adding new post 
        const params: PutItemCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,

            Item: {
                dataKey: {S: timeStamp},
                dataType: {S: "post"},
                displayName: {S: `${newPost.displayName}`},
                userName: {S: `${newPost.userName}`},
                displayImg: {S: `${newPost.displayImg}`},
                postBody: {S: `${newPost.postBody}`},
                likes: {SS: ["default"]},
                comments: {L: []}
            }
        }

        try {
            const data = await ddbClient.send(new PutItemCommand(params));
        } catch (err) {
            console.log(err);
            return new HTTPResponse(500, "Failed to add post to database");
        }
        
        return new HTTPResponse(200, "Post added successfully");

    }
    
    return new HTTPResponse(400, "Unable to add post", "most outer if-else");
}