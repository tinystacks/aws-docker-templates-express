import * as express from "express";
import * as uuid from "uuid";
import * as bodyParser from "body-parser";

import { createItem } from "./aws-helpers";
import { putItem } from "./put-item";
import { putAuthenticatedItem } from "./put-authenticated-item";
import { getItem } from "./get-item";
// Constants
const PORT = 8000;
const HOST = '0.0.0.0';


// App handlers
const app = express();
const parser = bodyParser.text();

app.get("/ping", (req, res) => {
  res.status(200).send();
});

app.put('/item', parser, putItem);
app.get('/item', parser, getItem);
app.put('/authenticated-item', parser, putAuthenticatedItem);
app.get('/authenticated-item', parser, putAuthenticatedItem);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
