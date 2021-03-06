
import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost2, testPost3, testUser1, testUser2, testUser3 } from '../Global/TestData'
import { handler } from './GetGlobalFeed'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';

afterAll(() => {
  ddbDocClient.destroy();
});

test('it should get all posts for the global feed', async () => {
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

  const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post`)
    .method('GET')
    .header('test get all posts')


  const result = await handler(mockEvent._event);



  const checker = new HTTPResponse(200, [testUser1, testUser2, testUser3])

  expect(result.statusCode).toEqual(checker.statusCode);
})

test('it should be unable to grab feed', async () => {

  const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post`)
    .method('GET')
    .header('test get all posts')

  mockEvent._event = null;
  const result = await handler(mockEvent._event);


  expect(result.statusCode).toEqual(400);

})