import * as express from "express";
import { deleteDynamoDbItem, getDynamoDbItem, putDynamoDbItem, updateDynamoDbItem } from "./dynamodb-item";
import { deletePostgresItem, getPostgresDbItem, createPostgresDbItem, updatePostgresItem  } from "./postgresdb-item";
import { deleteAuthenticatedItem, getAuthenticatedItem, putAuthenticatedItem, updateAuthenticatedItem } from "./authenticated-item";
import { deleteItem, getItem, putItem, updateItem } from "./local-item";

const client = require('prom-client');
const register = new client.Registry();
register.setDefaultLabels({
  app: 'example-nodejs-app',
});
client.collectDefaultMetrics({ register });

// Constants
const PORT = process.env.STAGE === "local" ? 8080 : 80;
const HOST = '0.0.0.0';

// App handlers
const app = express();
app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send();
});

app.get('/metrics', async (req: any, res: any) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.send(error);
  }
});

app.put('/local-item', putItem);
app.get('/local-item', getItem);
app.post('/local-item', updateItem);
app.delete('/local-item', deleteItem);

app.put('/dynamodb-item', putDynamoDbItem);
app.post('/dynamodb-item', updateDynamoDbItem);
app.get('/dynamodb-item', getDynamoDbItem);
app.delete('/dynamodb-item', deleteDynamoDbItem);

app.get('/postgresql-item/:id', getPostgresDbItem);
app.get('/postgresql-item', getPostgresDbItem);
app.put('/postgresql-item', createPostgresDbItem);
app.post('/postgresql-item/:id', updatePostgresItem);
app.delete('/postgresql-item/:id', deletePostgresItem);

app.put('/authenticated-dynamodb-item', putAuthenticatedItem);
app.get('/authenticated-dynamodb-item', getAuthenticatedItem);
app.post('/authenticated-dynamodb-item', updateAuthenticatedItem);
app.delete('/authenticated-dynamodb-item', deleteAuthenticatedItem);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
