import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {GetCommand, GetCommandInput, PutCommand, PutCommandInput, UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";
import Post from "../Global/Post";
import { timeStamp } from "console";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    console.log(event.pathParameters, event.body);

    //Take our user's username key from path parameters
    if(event.pathParameters && event.body) {
        let username = event.pathParameters.username;

        //Take follower from { event.body }
        let body = JSON.parse(event.body)
        let follower = body.follower

        //Now we query the user for the following list
        const getFollowingParams: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType : "user",
                dataKey : username
            },
            ProjectionExpression: "following"
        }

        //Initial step--> Grab following array off of user
        const resultQuery = await ddbDocClient.send(new GetCommand(getFollowingParams));

        //Iterate over following list to find if follower exists already
        let temp = resultQuery.Item
        console.log(temp);
        console.log(temp?.following)
        let followingArray = temp?.following;

        //Next --> iterate over array to find if follower is already there
        let index = -1;
        for(let i = 0; i < followingArray.length; i++) {
             if(followingArray[i] == follower)
                index = i;
        }
        console.log(index);

        //Wrap our new follower in an array so we can append later
        let tempArray = [];
        tempArray.push(follower);

        //If follower is already there remove from array
        if(index != -1) {
            const removeCommentParams: UpdateCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
                Key: {
                    dataType: "user",
                    dataKey: username
                },
                UpdateExpression: `REMOVE following[${index}]`,
                ReturnValues: "ALL_OLD"
            }
            const removeQuery = await ddbDocClient.send(new UpdateCommand(removeCommentParams));                

            //Else follower is not in the list --> add him/her
        } else {

            const addFollowerParams: UpdateCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
                Key: {
                    dataType: "user",
                    dataKey: username,
                },
                ExpressionAttributeValues : {
                    ":newFollower": tempArray,
                },
                UpdateExpression: 
                    "SET following = list_append(following, :newFollower)",
                ReturnValues: "ALL_NEW"
            }
    
            
            const data = await ddbDocClient.send(new UpdateCommand(addFollowerParams));
            console.log(data.Attributes);
        }

        return new HTTPResponse(200, "Successfully followed/unfollowed");
    
}
    return new HTTPResponse(400, "Unable to follow/unfollow")
}