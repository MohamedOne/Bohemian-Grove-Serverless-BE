import { ddbDocClient } from '../Global/DynamoDB'
import {GetCommand, GetCommandInput, PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { handler } from './AddUserImg'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'
import Post from '../Global/Post';
import { testUser1 } from '../Global/TestData'


afterAll(() => {
    ddbDocClient.destroy();
  });
  
test('it should update the users image', async() => {

const sendData = {
    profileImg : "Surfboard.png"
}

const mockEvent = lambdaEventMock.apiGateway()
.path(`/user/${testUser1.dataKey}`)
.method('PUT')
.header('test if we are updating the image')
.body(sendData)

mockEvent._event.pathParameters = {
    userName: testUser1.dataKey
}

const result = await handler(mockEvent._event);

const params: GetCommandInput = {
    TableName: process.env.DDB_TABLE_NAME,
    Key: {
        dataType: "user",
        dataKey: `${testUser1.dataKey}`
    }
}

const check = await ddbDocClient.send(new GetCommand(params));
const checker = new HTTPResponse(200, check.Item);

expect(result.statusCode).toEqual(checker.statusCode);

})