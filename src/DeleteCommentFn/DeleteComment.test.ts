import { ddbDocClient } from '../Global/DynamoDB'
import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1 } from '../Global/TestData'
import { handler } from './DeleteComment'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
    ddbDocClient.destroy();
  });
  
  test('it should delete comment', async() => {

    const sendData = {
        comment: "this post sucks"
    }

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${testPost1.dataKey}`)
    .method('PUT')
    .header('test if we are deleting a comment')
    .body(sendData)

    mockEvent._event.pathParameters = {
        timeStamp: testPost1.dataKey
    }

    const result = await handler(mockEvent._event);

        //Grab comment array
        const queryParams: GetCommandInput = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: {
                dataType: "post",
                dataKey: testPost1.dataKey,
            },
            ProjectionExpression: "comments"
        }

    const check = await ddbDocClient.send(new GetCommand(queryParams));
    const checker = new HTTPResponse(200, check.Item);

    expect(result.statusCode).toEqual(checker.statusCode);

  })