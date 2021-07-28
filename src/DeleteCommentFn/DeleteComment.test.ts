import { ddbDocClient } from '../Global/DynamoDB'
import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1 } from '../Global/TestData'
import { handler } from './DeleteComment'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
    ddbDocClient.destroy();
  });
  
  test('it should delete a comment', async () => {
    const putParams1 = {
      TableName: process.env.DDB_TABLE_NAME,
      Item: testPost1
    }
    
    await ddbDocClient.send(new PutCommand(putParams1));

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post`)
    .method('DELETE')
    .header('delete a comment')
    
    mockEvent._event.pathParameters = {
        timeStamp : testPost1.dataKey,
        commentStamp : testPost1.comments[0].commentStamp,
    }

  
    const result = await handler(mockEvent._event);
  
  
    expect(result.statusCode).toEqual(200);
  
  })

  test('it should be unable to delete a comment', async() => {

    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testPost1
      }
      
      await ddbDocClient.send(new PutCommand(putParams1));
  
      const mockEvent = lambdaEventMock.apiGateway()
      .path(`/post`)
      .method('DELETE')
      .header('delete a comment')

      const result = await handler(mockEvent._event);    
    
      expect(result.statusCode).toEqual(400);
  })