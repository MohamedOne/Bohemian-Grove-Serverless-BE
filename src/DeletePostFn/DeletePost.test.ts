import { ddbDocClient } from '../Global/DynamoDB'
import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1 } from '../Global/TestData'
import { handler } from './DeletePost'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
  ddbDocClient.destroy();
});

test('it should delete post', async() => {

    const params: DeleteCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,

        Key: {
            dataType: "post",
            dataKey: testPost1.dataKey
        }
    }

   await ddbDocClient.send(new DeleteCommand(params));

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${testPost1.dataKey}`)
    .method('DELETE')
    .header('test if we are deleting post')



  const result = await handler(mockEvent._event);


  const params1: QueryCommandInput = {
    TableName: process.env.DDB_TABLE_NAME,
    KeyConditionExpression: "dataType = :p",
    ExpressionAttributeNames: {
        "#userN" : "userName"
    },
    ExpressionAttributeValues: {
        ":name" : "captain",
        ":p": "post",

    },
    FilterExpression: 
        "#userN = :name"
    ,
 
  }

  const check = ddbDocClient.send(new QueryCommand(params1));
  const checker = new HTTPResponse(200, check)

  expect(checker).toEqual(checker);

})