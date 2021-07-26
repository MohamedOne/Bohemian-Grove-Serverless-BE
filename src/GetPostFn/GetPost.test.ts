import { ddbDocClient } from '../Global/DynamoDB';
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost3 } from '../Global/TestData';
import { handler } from './GetPost';
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';


afterAll(() => {
    ddbDocClient.destroy();
});

test('it should get a post from the databse', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost1
    }

    await ddbDocClient.send(new PutCommand(putParams1));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/`)
        .method('GET')
        .header('test get post')

    mockEvent._event.pathParameters = { postId: testPost1.dataKey }

    const result = await handler(mockEvent._event);
    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: testPost1.dataKey
        }
    }
    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item)

    expect(checker).toEqual(result);
})

test('if body is null it should return a 400 status code saying body was null', async () => {


    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/user/`)
        .method('POST')
        .header('test get post')


    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(400);
    expect(result.body).toBe('["path params was null"]')

})

