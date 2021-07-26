import { ddbDocClient } from '../Global/DynamoDB'
import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1 } from '../Global/TestData'
import { handler } from './DeleteUser'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
  ddbDocClient.destroy();
});

test('it should delete requested user', async() => {

    const params: DeleteCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        Key: {
            dataType: "user",
            dataKey: "admin"
        }
    }

    await ddbDocClient.send(new DeleteCommand(params));

    const mockEvent = lambdaEventMock.apiGateway()
  .path(`/user/${testUser1.dataKey}`)
  .method('DELETE')
  .header('test if we are deleting user')



  const result = await handler(mockEvent._event);


  const params1: QueryCommandInput = {
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

  const check = await ddbDocClient.send(new QueryCommand(params1));
  const checker = new HTTPResponse(200, check)

  expect(checker).toEqual(checker);

})