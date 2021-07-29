import { ddbDocClient } from '../Global/DynamoDB'
import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { testUser1 } from '../Global/TestData'
import { handler } from './FollowUnfollow'
import { HTTPResponse } from '../Global/DTO';
import lambdaEventMock from 'lambda-event-mock';

afterAll(() => {
    ddbDocClient.destroy();
  });
  
  test('it should add a follower', async () => {

    //Add a user to our table
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
      }

      await ddbDocClient.send(new PutCommand(putParams1));


      const sendBody = {
          follower: "megan"
      }
      const mockEvent = lambdaEventMock.apiGateway()
      .path(`/user`)
      .method('PUT')
      .header('alter follower list')
      .body(sendBody)
    
    mockEvent._event.pathParameters = {
        username : "theSponge"
    }

    const result = await handler(mockEvent._event);
  
  
    expect(result.statusCode).toEqual(200);

  })

  test('it should remove a follower', async() => {

    //Add a user to our table
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
      }

      await ddbDocClient.send(new PutCommand(putParams1));


      const sendBody = {
          follower: "mo"
      }
      const mockEvent = lambdaEventMock.apiGateway()
      .path(`/user`)
      .method('PUT')
      .header('alter follower list')
      .body(sendBody)
    
    mockEvent._event.pathParameters = {
        username : "theSponge"
    }

    const result = await handler(mockEvent._event);
  
  
    expect(result.statusCode).toEqual(200);

  })

  test('it should be unable to add or remove a follower', async() => {

    //Add a user to our table
    const putParams1 = {
        TableName: process.env.DDB_TABLE_NAME,
        Item: testUser1
      }

      await ddbDocClient.send(new PutCommand(putParams1));



      const mockEvent = lambdaEventMock.apiGateway()
      .path(`/user`)
      .method('PUT')
      .header('alter follower list')

    
    mockEvent._event.pathParameters = {
        username : "theSponge"
    }

    const result = await handler(mockEvent._event);
  
  
    expect(result.statusCode).toEqual(400);
  })