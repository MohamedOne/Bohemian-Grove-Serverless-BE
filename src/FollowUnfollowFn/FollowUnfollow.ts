import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import { UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import Post from "../Global/Post";
import { timeStamp } from "console";
import { fips } from "crypto";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    
    // Parse the data and determine which operation to perform
    const data = JSON.parse(event.body || '{}');

    if (data.isFollowing == undefined || !data.userToFollow || !event.pathParameters) return new HTTPResponse(400, {message: "Invalid input"});
    
    const operation = data.isFollowing ? "DELETE" : "ADD";

    // Update the follower
    const followerParams: UpdateItemCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: {S: "user"},
            dataKey: {S: event.pathParameters.userName || ''}
        },
        ExpressionAttributeValues: {
            ":u": {SS: [data.userToFollow]}
        },
        UpdateExpression: `${operation} following :u`
    }

    try {
        await ddbClient.send(new UpdateItemCommand(followerParams));
    } catch (err) {
        console.log("Follower error ", err);
        return new HTTPResponse(500, {message: "Failed to update follower"});
    }

    // Update the followee
    const followeeParams: UpdateItemCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: {S: "user"},
            dataKey: {S: data.userToFollow}
        },
        ExpressionAttributeValues: {
            ":u": {SS: [event.pathParameters.userName || '']}
        },
        UpdateExpression: `${operation} followers :u`
    }

    try {
        await ddbClient.send(new UpdateItemCommand(followeeParams));
    } catch (err) {
        console.log("Followee error ", err);
        return new HTTPResponse(500, {message: "Failed to update followee"});
    }

    // Return success
    return new HTTPResponse(200);

}