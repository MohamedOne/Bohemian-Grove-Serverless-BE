import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {GetCommand, GetCommandInput} from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    //Grab our data key from path paramaters
    if (event.pathParameters) {
        console.log("Received userName: " + event.pathParameters.userName);
        let userName = event.pathParameters.userName;

        const params: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "user",
                dataKey: userName
            }
        }

        try {
            const data = await ddbDocClient.send(new GetCommand(params));
            //Return requested user
            return new HTTPResponse(200, data.Item);
        } catch (err) {
            console.log(err);
            return new HTTPResponse(400, "Unable to get user");  
      }
    }   

    //Default response if we can't grab user
    return new HTTPResponse(400, "Unable to get user");
    }
