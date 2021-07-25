import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {DeleteCommand, DeleteCommandInput, UpdateCommand, UpdateCommandInput} from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters && event.body) {

        //Take username key from path parameters
        console.log("Received username: " + event.pathParameters.userName);
        let userName = event.pathParameters.userName;

        //Get new image from { event.body }
        let body = JSON.parse(event.body);
        let newImg = body.profileImg;


        const params: UpdateCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "user",
                dataKey: userName
            },
            ExpressionAttributeValues: {
                ":img": newImg,
            },
            UpdateExpression: "SET profileImg = :img",
            ReturnValues: "ALL_NEW"
        }

        try {
            //Update user profile img
            const data = await ddbDocClient.send(new UpdateCommand(params));
            return new HTTPResponse(200, data.Attributes);
        } catch (err) {
            return new HTTPResponse(400, "Unable to update image");  
    }
    }   

    //Default response if we can't update img
    return new HTTPResponse(400, "Unable to update image");

}
