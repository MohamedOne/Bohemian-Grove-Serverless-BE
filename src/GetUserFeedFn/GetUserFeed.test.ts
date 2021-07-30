
import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost2, testPost3, testPost4, testPost5, testUser1 } from '../Global/TestData'
import { handler } from './GetUserFeed'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from "lambda-event-mock"

afterAll(() => {
    ddbDocClient.destroy();
});

test('it should get all posts from user provided', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost1
    }
    const putParams2 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost2
    }
    const putParams3 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost3
    }
    const putParams4 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
    }
    const putParams5 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost5
    }

    await ddbDocClient.send(new PutCommand(putParams1));
    await ddbDocClient.send(new PutCommand(putParams2));
    await ddbDocClient.send(new PutCommand(putParams3));
    await ddbDocClient.send(new PutCommand(putParams4));
    await ddbDocClient.send(new PutCommand(putParams5))

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/user/${testPost5.userName}`)
        .method('GET')
        .header('test get user feed')


    mockEvent._event.pathParameters = { userName: testPost5.userName };

    const result = await handler(mockEvent._event);
    const checker = new HTTPResponse(200, [testPost5])

    expect(result.statusCode).toEqual(200);
})

test('it should error because path params was null', async () => {


    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/user/${testPost5.userName}`)
        .method('GET')
        .header('test get user feed')

    const result = await handler(mockEvent._event);
    const checker = new HTTPResponse(400, "path params was null");

    expect(result).toEqual(checker);
})