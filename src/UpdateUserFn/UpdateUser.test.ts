import { ddbDocClient } from '../Global/DynamoDB';
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { testUser1, testUser2 } from '../Global/TestData';
import { handler } from './UpdateUser';
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';


afterAll(() => {
    ddbDocClient.destroy();
});

test('it should update the user in the databse', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
    }

    await ddbDocClient.send(new PutCommand(putParams1));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/${testUser1.dataKey}`)
        .method('PUT')
        .header('test update user')
        .body(testUser2);



    const result = await handler(mockEvent._event);

    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "user",
            dataKey: 'admin'
        }
    }

    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item)

    expect(checker).toEqual(result);
})

test('if body is null it should return a 400 status code saying body was null', async () => {


    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/${testUser1.dataKey}`)
        .method('POST')
        .header('test get post')
        .body(null);

    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toBe('["body was null"]')

})
