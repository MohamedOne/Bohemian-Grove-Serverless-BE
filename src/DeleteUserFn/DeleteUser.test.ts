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

    // const params: DeleteCommandInput = {
    //     TableName: process.env.DDB_TABLE_NAME,
    //     Key: {
    //         dataType: "user",
    //         dataKey: "theSponge"
    //     }
    // }

    // await ddbDocClient.send(new DeleteCommand(params));

    const mockEvent = lambdaEventMock.apiGateway()
  .path(`/user/${testUser1.dataKey}`)
  .method('DELETE')
  .header('test if we are deleting user')

  

  mockEvent._event.pathParameters = {
      userName: testUser1.dataKey
    }
    console.log(mockEvent._event)
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
  const checker = new HTTPResponse(200, check.Items)

  expect(result.statusCode).toEqual(checker.statusCode);

})

test('it should not be able to delete a user', async() => {

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/user/${testUser1.dataKey}`)
    .method('DELETE')
    .header('test if we are deleting user')
  
      console.log(mockEvent._event)
    const result = await handler(mockEvent._event);
  
      expect(result.statusCode).toEqual(400);

})