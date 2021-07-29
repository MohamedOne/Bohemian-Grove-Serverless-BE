
import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost2, testPost3, testUser1, testUser2, testUser3 } from '../Global/TestData'
import { handler } from './GetUserPost'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';

afterAll(() => {
  ddbDocClient.destroy();
});


test('it should grab all posts pertaining to one user', async () => {
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

    const userName = testPost2.userName;

    const mockEvent = lambdaEventMock.apiGateway()
      .path(`/post/${userName}/specific`)
      .method('GET')
      .header('test get all user specific posts')

      mockEvent._event.pathParameters = {
          userName : testPost2.userName
      }
  
  
    const result = await handler(mockEvent._event);
    
    expect(result.statusCode).toEqual(200);
  })

  test('it should not be able to grab user specific posts', async() => {
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

    const userName = testPost2.userName;
    
    const mockEvent = lambdaEventMock.apiGateway()
      .path(`/post/${userName}/specific`)
      .method('GET')
      .header('test get all user specific posts')

    const result = await handler(mockEvent._event);
    
    expect(result.statusCode).toEqual(400);
  })