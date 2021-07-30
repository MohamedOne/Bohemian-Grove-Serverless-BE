import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { GetCommand, GetCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";



export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    // Your code here

    if (event.pathParameters != null) {
        
        const getFollowerParams: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType : "user",
                dataKey : event.pathParameters.userName
            },
            ProjectionExpression: "follower"
        }

        //Initial step--> Grab following array off of user
        const resultQuery = await ddbDocClient.send(new GetCommand(getFollowerParams));

        //Iterate over following list to find if follower exists already
        let temp = resultQuery.Item
        console.log(temp);
        console.log(temp?.follower)
        let followerArray = temp?.follower;

        //Iterate over usernames in follower array and get all posts
        let userFeed = [];
        for(let i = 0; i < followerArray.length; i++) {
            const paramsFollower: QueryCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
    
                KeyConditionExpression: 'dataType = :p',
                ExpressionAttributeValues: {
                    ":p": "post",
                    ":s": followerArray[i],
                    
                },
                FilterExpression: "userName = :s"
    
    
            }
            const dataFollower = await ddbDocClient.send(new QueryCommand(paramsFollower));
            console.log(dataFollower.Items);
            let tempFeed: any = dataFollower.Items;
            for(let elem of tempFeed) {
                userFeed.push(elem);
            }
            
            

        }
        console.log(userFeed);


        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,

            KeyConditionExpression: 'dataType = :p',
            ExpressionAttributeValues: {
                ":p": "post",
                ":s": event.pathParameters.userName
            },
            FilterExpression: "contains(userName, :s)"


        }
        const data = await ddbDocClient.send(new QueryCommand(params));
        const feed = data.Items;
        return new HTTPResponse(200, userFeed);
    }
    return new HTTPResponse(400, "path params was null");
}
