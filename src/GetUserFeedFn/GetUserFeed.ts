import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import Post from '../Global/Post'
import { GetItemCommand, GetItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";



export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    // Parse data
    if (!event.pathParameters || !event.pathParameters.userName) return new HTTPResponse(400, { message: "Invalid input" });

    // Determine operation to perform
    if (!event.queryStringParameters || !event.queryStringParameters.following) {

        // Query dynamo
        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            KeyConditionExpression: 'dataType = :p',
            ExpressionAttributeValues: {
                ":p": { S: "post" },
                ":s": { S: event.pathParameters.userName || ' ' }
            },
            FilterExpression: "userName = :s",
            ScanIndexForward: false
        }

        let data;
        try {
            data = await ddbClient.send(new QueryCommand(params));
        } catch (err) {
            console.log(err);
            return new HTTPResponse(500, "Failed to get user feed");
        }

        // Return success
        return new HTTPResponse(200, data.Items);

    } else {
        
        // Get user data from dynamo 
        const getParams: GetItemCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: {S: "user"},
                dataKey: {S: event.pathParameters.userName || ' ' }
            }
        }

        let userData;
        try {
            userData = await ddbClient.send(new GetItemCommand(getParams));
        } catch (err) {
            console.log(err);
            return new HTTPResponse(500, "Failed to get follower list");
        }

        // If user isn't following anyone, return an empty array
        if (!userData.Item?.following) return new HTTPResponse(200, []);
        
        // Generate list of followed users
        let following = userData.Item?.following.SS || [];

        const attributes: any = {};
        attributes[":p"] = {S: "post"}

        let followList = "(";
        for (let i = 0; i < following.length; i++) {
            attributes[":user" + i] = {S: following[i]};
            followList += ":user" + i;
            if (following[i+1] != undefined) followList += ", ";
        }
        followList += ")";
        
        // Get list of posts from followers
        const params: QueryCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            ExpressionAttributeValues: attributes,
            KeyConditionExpression: "dataType = :p",
            FilterExpression: "userName IN " + followList,
            ScanIndexForward: false
        }

        let result;
        try {
            result = await ddbClient.send(new QueryCommand(params));
        } catch (err) {
            console.log(err);
            return new HTTPResponse(500, {message: "Failed to get post array"});
        }

        // Return success
        return new HTTPResponse(200, result.Items);
    }

}
