import { ddbDocClient } from '../Global/DynamoDB'
import {PutCommand, PutCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { handler } from './CreatePost'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock'
import Post from '../Global/Post';
import { testPost1 } from '../Global/TestData';


afterAll(() => {
    ddbDocClient.destroy();
  });

test('it should create a new post', async() => {

    const tempPost: Post = {
        userName : "bigGulp",
        timeStamp: "Dec152016",
        displayName: "homeSlice",
        displayImg: "captainHat.png",
        postBody: "Doing this on my phone",
        likes: ["tom", "jerry", "berry"],
        comments: ["hi", "iam", "writing my first comment"],
        postImg: "anotherImg.png"

    }


    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${tempPost.timeStamp}`)
    .method('POST')
    .header('test if we are creating post')
    .body(tempPost)

    mockEvent._event.requestContext.authorizer = {
        claims : {
            username : "bigGulp"
        }
    }

    const result = await handler(mockEvent._event);

    const params : QueryCommandInput = {
        TableName: process.env.DDB_TABLE_NAME,
        ExpressionAttributeValues: {
            ":dK" : "Dec152016",
            ":dT" : "post"
        },
        KeyConditionExpression : "dataKey = :dK AND dataType = :dT"
    }
    const data = await ddbDocClient.send(new QueryCommand(params));
    const checker = new HTTPResponse(200, data.Items);

    expect(result.statusCode).toEqual(checker.statusCode);

})

test('it should not create a new post', async() => {

    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${testPost1.dataKey}`)
    .method('POST')
    .header('test if we are creating post')

    const result = await handler(mockEvent._event);

    expect(result.statusCode).toEqual(400);

})

test('it should not create a new post', async() => {

    const tempPost: Post = {
        userName : "bigGulp",
        timeStamp: "Dec152016",
        displayName: "homeSlice",
        displayImg: "captainHat.png",
        postBody: "Doing this on my phone",
        likes: ["tom", "jerry", "berry"],
        comments: ["hi", "iam", "writing my first comment"],
        postImg: "anotherImg.png"

    }


    const mockEvent = lambdaEventMock.apiGateway()
    .path(`/post/${tempPost.timeStamp}`)
    .method('POST')
    .header('test if we are creating post')
    .body(tempPost)

    mockEvent._event.requestContext.authorizer = {
        claims : {
            username : "bgGulp"
        }
    }

    const result = await handler(mockEvent._event);
    

    expect(result).toBeUndefined();
})
