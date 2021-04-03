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
  const body = JSON.parse(req.body);
  items.set(uuid.v4(), {
    title: body.title,
    content: body.content
  });
  res.status(200).send();
}
export function updateItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body = JSON.parse(req.body);
  if (!body.itemId || !items.has(body.itemId)) {
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
  const body = JSON.parse(req.body);
  if (!body.itemId || !items.has(body.itemId)) {
    res.status(500).send();
  } else {
    items.delete(body.itemId);
    res.status(200).send();
  }
}

export function getItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  if (!!req.body && !!JSON.parse(req.body)) {
    const body = JSON.parse(req.body);
    if (!body.itemId || !items.has(body.itemId)) {
      res.status(500).send();
    } else {
      res.status(200).send({ itemId: body.itemId, ...items.get(body.itemId) });
    }
  } else {
    const reducedItems: ({ itemId: string } & Item)[] = [];
    items.forEach((value: Item, key: string) => {
      reducedItems.push({ itemId: key, ...value });
    })
    res.status(200).send(reducedItems);
  }
}