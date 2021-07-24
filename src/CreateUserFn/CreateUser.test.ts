import { ddbDocClient } from '../Global/DynamoDB';
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { testUser1, testUser3 } from '../Global/TestData';
import { handler } from './CreateUser';
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';
import User from '../Global/User';


afterAll(() => {
    ddbDocClient.destroy();
});

test('it should create a user', async () => {

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/${testUser1.dataKey}`)
        .method('POST')
        .header('test create user')
        .body(testUser1);

    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(201);

    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "user",
            dataKey: testUser1.dataKey
        }
    }
    const check = await ddbDocClient.send(new GetCommand(params));
    const checker: User = new User(check.Item);
    const userResult: User = new User(testUser1);

    expect(checker).toEqual(userResult);
})

test('it should not make a user because it already exists', async () => {

    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
    }

    await ddbDocClient.send(new PutCommand(putParams1));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/${testUser1.dataKey}`)
        .method('POST')
        .header('test create user')
        .body(testUser1);

    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(403);

    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "user",
            dataKey: testUser1.dataKey
        }
    }
    const check = await ddbDocClient.send(new GetCommand(params));
    const checker: User = new User(check.Item);
    const userResult: User = new User(testUser1);

    expect(checker).toEqual(userResult);

})

test('if body is null it should return a 400 status code saying body was null', async () => {


    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/${testUser1.dataKey}`)
        .method('POST')
        .header('test create user')
        .body(null);

    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toBe('["body was null"]')

})

