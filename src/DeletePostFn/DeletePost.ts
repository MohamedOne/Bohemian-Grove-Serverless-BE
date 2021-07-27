import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import {DeleteCommand, DeleteCommandInput} from "@aws-sdk/lib-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.pathParameters) {

        //Take timestamp key from path parameters
        console.log("Received timeStamp: " + event.pathParameters.timeStamp);
        let timeStamp = event.pathParameters.timeStamp;

        const params: DeleteCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: timeStamp
            }
        }

        try {
            //Delete requested user
            await ddbDocClient.send(new DeleteCommand(params));
            return new HTTPResponse(200, "Post deleted successfully!");
        } catch (err) {
            console.log(err);
    }
    }   

    //Default response if we can't grab user
    return new HTTPResponse(400, "Unable to delete post");

}
