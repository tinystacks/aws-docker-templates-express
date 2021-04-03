
import * as AWS from "aws-sdk";
import { Request } from "express";

const ddbClient = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

export function getUserData(req: Request) {
  const jwtToken = req.header('authorization').split(' ');
  var auth_params = {
    AccessToken: jwtToken[1]
  };

  return cognito.getUser(auth_params).promise().then(function (data) {
    const userAttr = new Map(data.UserAttributes.map(i => [i.Name, i.Value]));
    return userAttr.get('sub');
  }).catch(function (err) {
    console.log(err);
    throw err;
  });
}

export function createItem(userId: string, itemId: string, title: string, content: string) {
  const params = {
    TableName: process.env.TABLE_NAME, // [ProjectName]
    // Item contains the following attributes:
    // - userId: authenticated user id from Cognito Identity pool
    // - itemId: a unique uuid for the item
    // - title: title of Item
    // - content: content of Item
    // - createdAt: current timestamp
    Item: {
      userId: userId,
      itemId: itemId,
      title: title,
      content: content,
      createdAt: Date.now()
    }
  };

  return ddbClient.put(params).promise();
}

export function updateItem(userId: string, itemId: string, title: string, content: string) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      "userId": userId,
      "itemId": itemId
    },
    UpdateExpression: "set info.title = :t, info.content=:c",
    ExpressionAttributeValues: {
      ":t": title,
      ":c": content,
    }
  };
  return ddbClient.update(params).promise();
}
export function deleteItem(userId: string, itemId: string) {
  return ddbClient.delete({
    TableName: process.env.TABLE_NAME,
    Key: {
      "userId": userId,
      "itemId": itemId,
    }
  }).promise();
}

export function listItems(userId: string) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  return ddbClient.query(params).promise();
}

export function getItem(userId: string, itemId: string) {
  return ddbClient.get({
    TableName: process.env.TABLE_NAME,
    Key: {
      "userId": userId,
      "itemId": itemId,
    }
  }).promise();
}