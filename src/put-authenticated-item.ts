import * as express from "express";
import * as uuid from "uuid";
import { createItem, getUserData } from "./aws-helpers";
import { addHeadersToResponse } from "./server-helpers";

export async function putAuthenticatedItem(req: express.Request, res: express.Response) {
  const body = JSON.parse(req.body);
  addHeadersToResponse(res);
  getUserData(req).then(userId => createItem(userId, uuid.v4(), body.title, body.content))
    .then(function(data) {
      res.status(200).send();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).send();
    });
}