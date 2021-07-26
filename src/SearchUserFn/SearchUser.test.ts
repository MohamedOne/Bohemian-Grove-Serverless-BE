import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1, testUser2, testUser3, testUser4 } from '../Global/TestData'
import { handler } from './SearchUser'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from "lambda-event-mock"

afterAll(() => {
    ddbDocClient.destroy();
});

test('it should return the users from the search params', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
    }
    const putParams2 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser2
    }
    const putParams3 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser3
    }

    await ddbDocClient.send(new PutCommand(putParams1));
    await ddbDocClient.send(new PutCommand(putParams2));
    await ddbDocClient.send(new PutCommand(putParams3));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/search`)
        .method('GET')
        .header('test user search')

    mockEvent._event.pathParameters = { displayName: testUser1.displayName }
    const result = await handler(mockEvent._event);

    const checker = new HTTPResponse(200, [testUser1])
    expect(result.body).toEqual(checker.body);
})