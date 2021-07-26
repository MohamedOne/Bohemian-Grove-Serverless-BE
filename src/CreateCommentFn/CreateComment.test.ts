import { ddbDocClient } from '../Global/DynamoDB'
import {GetCommand, GetCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { handler } from './CreateComment'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'
import Post from '../Global/Post';
import { testPost1 } from '../Global/TestData'


afterAll(() => {
    ddbDocClient.destroy();
  });
  

import Comment from 'src/Global/Comment';

test('it should create add a comment', async() => {

    let comment: Comment = {
        userName: "Mo",
        body: "here's a comment",
        timeStamp: 654
    }

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${testPost1.dataKey}`)
    .method('POST')
    .header('test if we are adding a comment')
    .body(comment)

    mockEvent._event.pathParameters = {
        timeStamp: testPost1.dataKey
    }

    const result = await handler(mockEvent._event);

    const params: GetCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "post",
            dataKey: `${testPost1.dataKey}`
        }
    }

    const check = await ddbDocClient.send(new GetCommand(params));
    const checker = new HTTPResponse(200, check.Item);

    expect(result).toEqual(checker);

})