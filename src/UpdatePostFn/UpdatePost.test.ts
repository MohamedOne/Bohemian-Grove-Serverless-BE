import { ddbDocClient } from '../Global/DynamoDB';
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { testUser1, testUser2, testPost1 } from '../Global/TestData';
import { handler } from './UpdatePost';
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';


afterAll(() => {
    ddbDocClient.destroy();
});

test('it should update the postBody in the databse', async () => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost1
    }

    await ddbDocClient.send(new PutCommand(putParams1));

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/${testPost1.dataType}`)
        .method('PUT')
        .header('test update post')
        .body(testPost1);



    const result = await handler(mockEvent._event);

    const params = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: '123'
        }
    }

    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item)

    expect(checker).toEqual(result);
})