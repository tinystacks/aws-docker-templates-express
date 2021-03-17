import { Request, Response } from "express";
import { getUserData, listItems } from "./aws-helpers";
import { addHeadersToResponse } from "./server-helpers";

export async function getItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  getUserData(req).then(userId => listItems("userId"))
    .then(function (data) {
      res.status(200).send(JSON.stringify(data));
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send();
    });
}