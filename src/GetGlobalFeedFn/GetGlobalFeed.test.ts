
import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { testPost1, testPost2, testPost3 } from '../Global/TestData'
import { handler } from './GetGlobalFeed'
import { HTTPResponse } from '../Global/DTO';

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

  const result = await handler();

  const params = {
    TableName: process.env.DDB_TABLE_NAME,
    KeyConditionExpression: 'dataType = post'
  }

  const check = await ddbDocClient.send(new QueryCommand(params));
  const checker = new HTTPResponse(200, check)

  expect(checker).toEqual(result);
})