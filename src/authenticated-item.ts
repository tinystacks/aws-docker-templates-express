import { Request, Response } from "express";
import { createItem, deleteItem, getItem, getUserData, listItems, updateItem } from "./aws-helpers";
import { addHeadersToResponse } from "./server-helpers";
import * as uuid from "uuid";

export async function putAuthenticatedItem(req: Request, res: Response) {
  const body = JSON.parse(req.body);
  addHeadersToResponse(res);
  getUserData(req)
  .then(userId => createItem(userId, uuid.v4(), body.title, body.content))
  .then(function(data) {
    res.status(200).send();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send();
  });
}

export async function updateAuthenticatedItem(req: Request, res: Response) {
  const body = JSON.parse(req.body);
  addHeadersToResponse(res);
  getUserData(req)
  .then(userId => updateItem(userId, body.itemId, body.title, body.content))
  .then(function(data) {
    res.status(200).send();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send();
  });
}

export async function deleteAuthenticatedItem(req: Request, res: Response) {
  const body = JSON.parse(req.body);
  addHeadersToResponse(res);
  getUserData(req)
  .then(userId => deleteItem(userId, body.itemId))
  .then(function(data) {
    res.status(200).send();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).send();
  });
}

export async function getAuthenticatedItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  getUserData(req).then(userId => {
    if (!!req.body && !!JSON.parse(req.body)) {
      return getItem(userId, JSON.parse(req.body).itemId);
    }
    return listItems(userId);
  })
  .then(function (data) {
    res.status(200).send(JSON.stringify(data));
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).send();
  });
}