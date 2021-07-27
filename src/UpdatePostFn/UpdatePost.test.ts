import { ddbDocClient } from '../Global/DynamoDB';
import { GetCommand, GetCommandInput, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { testPost1 } from '../Global/TestData';
import { handler } from './UpdatePost';
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';


afterAll(() => {
    ddbDocClient.destroy();
});

test('it should update the postBody in the database', async () => {
    
    const sendBody = {
        postBody : "new post body bby"
    }

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/${testPost1.dataKey}`)
        .method('PUT')
        .header('test update post')
        .body(sendBody);

    mockEvent._event.pathParameters = {
        timeStamp : `${testPost1.dataKey}`
    }

    const result = await handler(mockEvent._event);

    const params : GetCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: '123'
        }
    }

    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item)

    expect(checker.statusCode).toEqual(result.statusCode);
})

test('it should not update the postBody', async() => {

    const sendBody = {
        postBody : "new post body bby"
    }

    const mockEvent = lambdaEventMock.apiGateway()
        .path(`/post/${testPost1.dataKey}`)
        .method('PUT')
        .header('test update post')
        .body(sendBody);

    const result = await handler(mockEvent._event);

    const params : GetCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: '123'
        }
    }

    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item)

    expect(result.statusCode).toEqual(400);

})