import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbDocClient } from "../Global/DynamoDB";
import { HTTPResponse } from "../Global/DTO";
import User from "../Global/User";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.body != null) {
        const user: any = JSON.parse(event.body);
        const newUser: User = new User(user);

        const test = {
            dataKey: newUser.dataKey,
            dataType: newUser.dataType,
            displayName: newUser.displayName,
            email: newUser.email,
            profileImg: newUser.profileImg,
            followers: 0,
            following: []
        }
        const params: PutCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: test,
            ExpressionAttributeNames: {
                "#U": "dataKey"
            },
            ConditionExpression: "attribute_not_exists(#U)"
        }

        try {

            await ddbDocClient.send(new PutCommand(params));
            return new HTTPResponse(201);
        }
        catch (err) {
            if (err.name == "ConditionalCheckFailedException") {
                return new HTTPResponse(403, "A user with that name already exists.");
            } else {
                console.log(err);
                return new HTTPResponse(500, {message: "Failed to add user to database"});
            }
        }
    }
    return new HTTPResponse(400, "body was null");
}