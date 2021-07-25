import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {DeleteCommand, DeleteCommandInput} from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {


    if (event.pathParameters) {

            //Take username key from path parameters
            console.log("Received userName: " + event.pathParameters.userName);
            let userName = event.pathParameters.userName;

            const params: DeleteCommandInput = {
                TableName: process.env.DDB_TABLE_NAME,
                Key: {
                    dataType: "user",
                    dataKey: userName
                }
            }

            try {
                //Delete requested user
                await ddbDocClient.send(new DeleteCommand(params));
                return new HTTPResponse(200, "User deleted successfully!");
            } catch (err) {
                return new HTTPResponse(400, "Unable to delete user");  
        }
        }   

        //Default response if we can't grab user
        return new HTTPResponse(400, "Unable to delete user");
    }
