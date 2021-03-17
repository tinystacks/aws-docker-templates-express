To run this locally:

1. npm install
2. TABLE_NAME=[dynamodb table name] AWS_PROFILE=[profile in ~/.aws/credentials] AWS_SDK_LOAD_CONFIG=true node built/server.js
3. curl localhost:8000/items