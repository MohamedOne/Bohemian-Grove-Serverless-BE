jest.mock("../Global/DynamoDB");

import { ddbClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1 } from '../Global/TestData'
import { handler } from './FollowUnfollow'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe("FollowUnfollow function handler", () => {

  it("should fail with code 400 if invalid body is provided", async () => {
    const input = createEvent("aws:apiGateway", {} as APIGatewayProxyEvent);

    const result = await handler(input);

    expect(result.statusCode).toBe(400);
  });

  it("should fail with code 500 if first DynamoDB call fails", async () => {
    const inputBody = JSON.stringify({
      isFollowing: true,
      userToFollow: "bob"
    });
    const inputParams = {
      userName: "jeffrey"
    };
    const input = createEvent("aws:apiGateway", {body: inputBody, pathParameters: inputParams});
    ddbClient.send.mockImplementationOnce(() => {throw "there was an error"});

    const result = await handler(input);

    expect(result.statusCode).toBe(500);
  });

  it("should fail with code 500 if second DynamoDB call fails", async () => {
    const inputBody = JSON.stringify({
      isFollowing: true,
      userToFollow: "bob"
    });
    const inputParams = {
      userName: "jeffrey"
    };
    const input = createEvent("aws:apiGateway", {body: inputBody, pathParameters: inputParams});
    ddbClient.send.mockImplementationOnce(() => {return {};});
    ddbClient.send.mockImplementationOnce(() => {throw "there was an error"});

    const result = await handler(input);

    expect(result.statusCode).toBe(500);
  });

  it("should succeed with code 200 if both dynamo calls succeed", async () => {
    const inputBody = JSON.stringify({
      isFollowing: false,
      userToFollow: "bob"
    });
    const inputParams = {
      userName: "jeffrey"
    };
    const input = createEvent("aws:apiGateway", {body: inputBody, pathParameters: inputParams});
    ddbClient.send.mockImplementationOnce(() => {return {};});
    ddbClient.send.mockImplementationOnce(() => {return {};});

    const result = await handler(input);

    expect(result.statusCode).toBe(200);
  });

});