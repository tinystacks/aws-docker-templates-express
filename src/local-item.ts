import { Request, Response } from "express";
import * as uuid from "uuid";
import { addHeadersToResponse } from "./server-helpers";

type Item = {
  title: string;
  content: string;
};

const items = new Map<any, any>();

export function getItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  if (req.query.itemId) {
    const toReturn = items.get(req.query.itemId);
    toReturn.itemId = req.query.itemId;
    return res.status(200).json(toReturn);
  } else {
    res.status(400).json("No itemId provided");
  }
}

// return the list of all items
export function listItems(req: Request, res: Response) {
  addHeadersToResponse(res);
  const reducedItems: ({ itemId: string } & Item)[] = [];
  items.forEach((value: Item, key: string) => {
    reducedItems.push({ itemId: key, ...value });
  })
  res.status(200).send(reducedItems);
}

export function putItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body = req.body;
  const id = uuid.v4();
  items.set(id, {
    title: body.title,
    content: body.content
  });
  res.status(200).send({
    id: id,
    title: body.title,
    content: body.content,
  });
}

export function updateItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body: any = req.body;
  const id = req.params.id;
  if (!body || !id) {
    res.status(500).send();
  } else {
    items.set(id, {
      title: body.title,
      content: body.content
    });
    res.status(200).send();
  }
}

export function deleteItem(req: Request, res: Response) {
  addHeadersToResponse(res);
  const body: any = req.body;
  const id = req.params.id;
  if (!body || !body.id) {
    res.status(500).send();
  } else {
    items.delete(body.id);
    res.status(200).send();
  }
}