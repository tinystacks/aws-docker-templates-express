import * as express from "express";
import * as bodyParser from "body-parser";

import { deleteDbItem, getDbItem, putDbItem, updateDbItem } from "./db-item";
import { deleteAuthenticatedItem, getAuthenticatedItem, putAuthenticatedItem, updateAuthenticatedItem } from "./authenticated-item";
import { deleteItem, getItem, putItem, updateItem } from "./local-item";

// Constants
const PORT = process.env.STAGE === "local" ? 8000 : 80;
const HOST = '0.0.0.0';


// App handlers
const app = express();
const parser = bodyParser.text();

app.get("/ping", (req, res) => {
  res.status(200).send();
});

app.put('/item', parser, putItem);
app.put('/item', parser, getItem);
app.put('/item', parser, updateItem);
app.put('/item', parser, deleteItem);

app.put('/db-item', parser, putDbItem);
app.post('/db-item', parser, updateDbItem);
app.get('/db-item', parser, getDbItem);
app.delete('/db-item', parser, deleteDbItem);

app.put('/authenticated-item', parser, putAuthenticatedItem);
app.get('/authenticated-item', parser, getAuthenticatedItem);
app.post('/authenticated-item', parser, updateAuthenticatedItem);
app.delete('/authenticated-item', parser, deleteAuthenticatedItem);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
