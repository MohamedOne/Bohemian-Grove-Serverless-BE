jest.mock('../Global/DynamoDB');

import { ddbDocClient } from "../Global/DynamoDB";
import { handler } from "./LikeUnlikePost";
import createEvent from "@serverless/event-mocks";
import { APIGatewayProxyEvent } from "aws-lambda";

describe("LikeUnlikePost function handler", () => {

    it("should fail with code 400 when invalid body provided", async () => {
        const input = createEvent("aws:apiGateway", {} as APIGatewayProxyEvent);

        const result = await handler(input);

        expect(result.statusCode).toBe(400);
    });

    it("should fail with code 500 when dynamo fails", async () => {
        const inputBody = JSON.stringify({
            isLiked: true,
            userName: "bob",
            timeStamp: "123"
        })
        const input = createEvent("aws:apiGateway", {body: inputBody} as APIGatewayProxyEvent);
        ddbDocClient.send.mockImplementationOnce(() => {throw "there was an error"});

        const result = await handler(input);

        expect(result.statusCode).toBe(500);
    });

    it("should succeed with code 200 when dynamo succeeds", async () => {
        const inputBody = JSON.stringify({
            isLiked: false,
            userName: "bob",
            timeStamp: "123"
        })
        const input = createEvent("aws:apiGateway", {body: inputBody} as APIGatewayProxyEvent);
        ddbDocClient.send.mockImplementationOnce(() => {return {}});

        const result = await handler(input);

        expect(result.statusCode).toBe(200);
    })

});