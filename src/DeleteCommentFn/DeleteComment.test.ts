import { ddbDocClient } from '../Global/DynamoDB'
import { DeleteCommand, DeleteCommandInput, GetCommand, GetCommandInput, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testPost1 } from '../Global/TestData'
import { handler } from './DeleteComment'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'

afterAll(() => {
    ddbDocClient.destroy();
  });
  
  test('it should delete comment', async() => {

  })