
import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost2, testPost4, testUser1 } from '../Global/TestData'
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
        Item: testPost4
    }

    await ddbDocClient.send(new PutCommand(putParams1));
    await ddbDocClient.send(new PutCommand(putParams2));
    await ddbDocClient.send(new PutCommand(putParams3));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/`)
        .method('GET')
        .header('test get post')
        .body(testPost1.userName);

    const result = await handler(mockEvent._event);


    expect(result.body).toEqual(testUser1.dataKey);
})