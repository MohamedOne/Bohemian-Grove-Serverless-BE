import { ddbDocClient } from '../Global/DynamoDB'
import {GetCommand, GetCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { handler } from './CreateComment'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'
import Post from '../Global/Post';
import { testPost1, testPost2, testPost3 } from '../Global/TestData'
import Comment from 'src/Global/Comment';


afterAll(() => {
    ddbDocClient.destroy();
  });
  
test('it should create add a comment', async() => {

    //Init database w/ fake posts
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
    
      await ddbDocClient.send(new PutCommand(putParams1));
      await ddbDocClient.send(new PutCommand(putParams2));
      await ddbDocClient.send(new PutCommand(putParams3));

    //A mock comment body to mimic PUT request
    let comment = {
        displayName: "Mo",
        comment: "here's a comment",
        displayImg: "captainmorgan.png"
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

    expect(result.statusCode).toEqual(200);

})

test('it should not be able to create a comment', async() => {
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost1
      }
      await ddbDocClient.send(new PutCommand(putParams1));


    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${testPost1.dataKey}`)
    .method('POST')
    .header('test if we are adding a comment')

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

    expect(result.statusCode).toEqual(400);

})