import { Request, Response } from "express";
import { createItem, getItem, listItems } from "./aws-helpers";
import { addHeadersToResponse } from "./server-helpers";
import * as uuid from "uuid";

export async function getDynamoDbItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  let promise;
  const body = req.body;
  if (!!req.body) {
    promise = getItem("SYSTEM", body.itemId);
  } else {
    promise = listItems("SYSTEM");
  }

  promise.then(function (data: any) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send();
    });
}

export async function putDynamoDbItem(req: Request, res: Response) {
  const body = req.body;
  addHeadersToResponse(res);
  createItem("SYSTEM", uuid.v4(), body.title, body.content)
    .then(function(data) {
      res.status(200).send();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send();
    });
}

export async function updateDynamoDbItem(req: Request, res: Response) {
  const body = req.body;
  addHeadersToResponse(res);
  createItem("SYSTEM", body.itemId, body.title, body.content)
    .then(function(data) {
      res.status(200).send();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send();
    });
}

export async function deleteDynamoDbItem(req: Request, res: Response) {
  const body = req.body;
  addHeadersToResponse(res);
  createItem("SYSTEM", uuid.v4(), body.title, body.content)
    .then(function(data) {
      res.status(200).send();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send();
    });
}