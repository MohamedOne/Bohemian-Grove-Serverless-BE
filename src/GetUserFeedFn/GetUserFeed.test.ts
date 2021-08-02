jest.mock("../Global/DynamoDB");

import createEvent from "@serverless/event-mocks";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ddbClient } from "../Global/DynamoDB";
import { handler } from "./GetUserFeed";

describe("GetUserFeed function handler", () => {

    it("should fail with code 400 if invalid input provided", async () => {
        const input = createEvent("aws:apiGateway", {} as APIGatewayProxyEvent);

        const result = await handler(input);

        expect(result.statusCode).toBe(400);
    });

    it("should fail with code 500 if single user query fails", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {throw "error"});

        const result = await handler(input);

        expect(result.statusCode).toBe(500);
    });

    it("should succeed with code 200 if single user quesry succeeds", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {return {}});

        const result = await handler(input);

        expect(result.statusCode).toBe(200);
    });

    it("should fail with code 500 if get follower list fails", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"},
            queryStringParameters: {following: true}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {throw "error"});

        const result = await handler(input);

        expect(result.statusCode).toBe(500);
    });

    it("should succeed with code 200 if user is not following anyone", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"},
            queryStringParameters: {following: true}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {return {}});

        const result = await handler(input);

        expect(result.statusCode).toBe(200);
    });

    it("should fail with code 500 if multi user query fails", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"},
            queryStringParameters: {following: true}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {return {Item: {following: {SS: ["bob", "joe"]}}};});
        ddbClient.send.mockImplementationOnce(() => {throw "error"});

        const result = await handler(input);

        expect(result.statusCode).toBe(500);
    });

    it ("should succeed with code 200 if multi user query succeeds", async () => {
        const inputBody: unknown = {
            pathParameters: {userName: "bob"},
            queryStringParameters: {following: true}
        }
        const input = createEvent("aws:apiGateway", inputBody as APIGatewayProxyEvent)
        ddbClient.send.mockImplementationOnce(() => {return {Item: {following: {SS: ["bob", "joe"]}}};});
        ddbClient.send.mockImplementationOnce(() => {return {}});

        const result = await handler(input);

        expect(result.statusCode).toBe(200);
    });

});