import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbClient } from "../Global/DynamoDB";
import { HTTPResponse } from "../Global/DTO";
import User from "../Global/User";


export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {

    if (event.body != null) {
        const user: any = JSON.parse(event.body);
        const newUser: User = new User(user);

        const test = {
            dataKey: {S: newUser.dataKey},
            dataType: {S: newUser.dataType},
            displayName: {S: newUser.displayName},
            email: {S: newUser.email},
            profileImg: {S: newUser.profileImg},
            followers: {SS: ["default"]},
            following: {SS: ["default"]}
        }
        const params: PutItemCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Item: test,
            ExpressionAttributeNames: {
                "#U": "dataKey"
            },
            ConditionExpression: "attribute_not_exists(#U)"
        }

        try {

            await ddbClient.send(new PutItemCommand(params));
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