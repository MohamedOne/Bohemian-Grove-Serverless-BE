jest.mock("../Global/DynamoDB");

import { ddbClient } from '../Global/DynamoDB'
import { handler } from './CreateUser'
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from 'aws-lambda';


describe("CreateUser function handler", () => {

    it("should fail with code 400 if invalid body is provided", async () => {

        const input = createEvent("aws:apiGateway", { body: null } as APIGatewayProxyEvent);

        const result = await handler(input);

        expect(result.statusCode).toBe(400);
    });

    it("should fail with code 500 if first DynamoDB call fails", async () => {
        const inputBody = JSON.stringify({

        });
        const inputParams = {
            userName: "jeffrey"
        };
        const input = createEvent("aws:apiGateway", { body: inputBody, pathParameters: inputParams });
        ddbClient.send.mockImplementationOnce(() => { throw "there was an error" });

        const result = await handler(input);

        expect(result.statusCode).toBe(500);
    });


    it("should fail with error code 403 user already exists", async () => {
        const inputBody = JSON.stringify({

        });
        const inputParams = {
            userName: "jeffrey"
        };
        const input = createEvent("aws:apiGateway", { body: inputBody, pathParameters: inputParams });


        ddbClient.send.mockImplementationOnce(() => { throw { name: "ConditionalCheckFailedException" } });



        const result = await handler(input);

        expect(result.statusCode).toBe(403);
    });

    it("should succeed with code 201 if both dynamo calls succeed", async () => {
        const inputBody = JSON.stringify({
            dataKey: "jeffrey"
        });
        const inputParams = {
            userName: "jeffrey"
        };
        const input = createEvent("aws:apiGateway", { body: inputBody, pathParameters: inputParams });


        ddbClient.send.mockImplementationOnce(() => { });



        const result = await handler(input);

        expect(result.statusCode).toBe(201);
    });

});