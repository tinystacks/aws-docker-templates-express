import * as express from "express";
import { json } from "body-parser";

import { deleteDynamoDbItem, getDynamoDbItem, putDynamoDbItem, updateDynamoDbItem } from "./dynamodb-item";
import { deletePostgresItem, getPostgresDbItem, createPostgresDbItem, updatePostgresItem  } from "./postgresdb-item";
import { deleteAuthenticatedItem, getAuthenticatedItem, putAuthenticatedItem, updateAuthenticatedItem } from "./authenticated-item";
import { deleteItem, getItem, putItem, updateItem } from "./local-item";


// Constants
const PORT = process.env.STAGE === "local" ? 8000 : 80;
const HOST = '0.0.0.0';


// App handlers
const app = express();
const parser = json();

app.get("/ping", (req, res) => {
  res.status(200).send();
});

app.put('/local-item', parser, putItem);
app.get('/local-item', parser, getItem);
app.post('/local-item', parser, updateItem);
app.delete('/local-item', parser, deleteItem);

app.put('/dynamodb-item', parser, putDynamoDbItem);
app.post('/dynamodb-item', parser, updateDynamoDbItem);
app.get('/dynamodb-item', parser, getDynamoDbItem);
app.delete('/dynamodb-item', parser, deleteDynamoDbItem);

app.get('/postgresql-item', parser, getPostgresDbItem);
app.post('/postgresql-item', parser, createPostgresDbItem);
app.put('/postgresql-item', parser, updatePostgresItem);
app.delete('/postgresql-item', parser, deletePostgresItem);

app.put('/authenticated-item', parser, putAuthenticatedItem);
app.get('/authenticated-item', parser, getAuthenticatedItem);
app.post('/authenticated-item', parser, updateAuthenticatedItem);
app.delete('/authenticated-item', parser, deleteAuthenticatedItem);
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
