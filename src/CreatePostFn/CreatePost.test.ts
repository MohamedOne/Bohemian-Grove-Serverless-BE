import { ddbDocClient } from '../Global/DynamoDB'
import {PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { handler } from './CreatePost'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'


afterAll(() => {
    ddbDocClient.destroy();
  });

test('it should create a new post', async() => {

    const params: PutCommandInput = {
        TableName: process.env.DDB_Table_Name, 
        Item: {
            dataType : "post",
            dataKey: "56789",
            displayName: "homeSlice",
            userName: "bigGulp",
            displayImg: "captainHat.png",
            postBody: "Doing this on my phone",
            likes: ["tom", "jerry", "berry"],
            timeStamp: "Dec152016",
            comments: ["hi", "iam", "writing my first comment"],
            postImg: "anotherImg.png",
        },
        ReturnValues: "ALL_OLD"
    }


    const putResult = await ddbDocClient.send(new PutCommand(params));

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/Dec152016`)
    .method('GET')
    .header('test if we are creating post')

    const result = await handler(mockEvent._event);

    expect(putResult).toEqual(result.body);

})


