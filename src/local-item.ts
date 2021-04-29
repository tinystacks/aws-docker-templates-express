import { Request, Response } from "express";
import { toEditorSettings } from "typescript";
import * as uuid from "uuid";
import { addHeadersToResponse } from "./server-helpers";

type Item = {
  title: string;
  content: string;
};

const items = new Map<string, Item>();

export function putItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body = req.body;
  const id = uuid.v4();
  items.set(id, {
    title: body.title,
    content: body.content
  });
  res.status(200).send({
    itemId: id,
    title: body.title,
    content: body.content,
  });
}

export function updateItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body: any = req.body;
  if (!body || !body.itemId || !items.has(body.itemId)) {
    res.status(500).send();
  } else {
    items.set(body.itemId, {
      title: body.title,
      content: body.content
    });
    res.status(200).send();
  }
}

export function deleteItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body: any = req.body;
  if (!body || !body.itemId || !items.has(body.itemId)) {
    res.status(500).send();
  } else {
    items.delete(body.itemId);
    res.status(200).send();
  }
}

export function getItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  if (!!req.body && !!req.body.itemId) {
    if (!req.body.itemId || !items.has(req.body.itemId)) {
      res.status(500).send();
    } else {
      res.status(200).send({ itemId: req.body.itemId, ...items.get(req.body.itemId) });
    }
  } else {
    const reducedItems: ({ itemId: string } & Item)[] = [];
    items.forEach((value: Item, key: string) => {
      reducedItems.push({ itemId: key, ...value });
    })
    res.status(200).send(reducedItems);
  }
}