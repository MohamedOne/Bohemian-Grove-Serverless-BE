
import { ddbDocClient } from '../Global/DynamoDB'
import { GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1 } from '../Global/TestData'
import { handler } from './GetUser'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
  ddbDocClient.destroy();
});

test('it should get user', async () => {

    const params1: GetCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "user",
            dataKey: "theGuack"
        }
    }

  await ddbDocClient.send(new GetCommand(params1));
 
  const mockEvent = lambdaEventMock.apiGateway()
  .path(`/post/${testUser1.userName}`)
  .method('GET')
  .header('test get user')



  const result = await handler(mockEvent._event);


  const params: QueryCommandInput = {
    TableName: process.env.DDB_TABLE_NAME,
    KeyConditionExpression: "dataType = :u",
    FilterExpression: 
        "#user = :a"
    ,
    ExpressionAttributeValues: {
        ":u": "user",
        ":a": "theGuack"
    },
    ExpressionAttributeNames: {
        "#user" : "userName"
    }
  }

  const check = await ddbDocClient.send(new QueryCommand(params));
  const checker = new HTTPResponse(200, check.Items)

  expect(checker).toEqual(checker);
})