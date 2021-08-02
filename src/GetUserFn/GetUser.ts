import { HTTPResponse } from "../Global/DTO";
import { ddbClient } from "../Global/DynamoDB";
import { APIGatewayProxyEvent } from "aws-lambda"
import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    //Grab our data key from path paramaters
    if (event.pathParameters) {
        console.log("Received userName: " + event.pathParameters.userName);
        let userName = event.pathParameters.userName;

        const params: GetItemCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: { S: "user" },
                dataKey: { S: userName || '' }
            }
        }

       
            const data = await ddbClient.send(new GetItemCommand(params));
            //Return requested user
            return new HTTPResponse(200, data.Item);
        
    }

    //Default response if we can't grab user
    return new HTTPResponse(400, "Unable to get user");
}
