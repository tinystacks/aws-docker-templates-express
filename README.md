## AWS Docker Templates - Express

The AWS Docker Templates for Express from TinyStacks enable launching an [Express Node.js](https://expressjs.com/) application as a Docker container using an AWS CodePipeline pipeline. The template includes its own small Express application, enabling developers to start a new Express project immediately. Developers can also take the AWS CodePipeline-specific files in this template and use them to ship an existing Express application as a Docker image on AWS. 

## License

This sample code is made available under a modified MIT license. See the LICENSE file.

## Outline

- [Prerequisites](#prerequisites)
- [Overview](#overview)
  - [Sample Application](#sample-application)
  - [Dockerfile](#dockerfile)
  - [Build Template](#build-template)
  - [Release Template](#release-template)
- [Getting Started](#getting-started)
  - [Existing Project](#existing-project)
- [Known Limitations](#known-limitations)

## Prerequisites

If you wish to build and test the Express server (both as a standalone server and hosted inside of a Docker container) before publishing on AWS, you should have [Node.js](https://nodejs.org/en/download/), [Express](https://expressjs.com/en/starter/installing.html), and [Docker](https://docs.docker.com/get-docker/) installed locally. 

If you wish to run just the Docker container locally, you will only need Docker.

This document also assumes that you have access to an AWS account. If you do not have one, [create one before getting started](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).

If executed locally, the use of AWS DynamoDB and Amazon Cognito in the Express application will require that you have valid credentials for AWS saved on your local computer. We recommend configuring your credentials locally as a login profile and using the `AWS_PROFILE` environment variable to designate which set of credentials to use. For other options on setting AWS credentials, see [Setting Credentials in Node.js](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

Further prerequisites for running these templates on AWS are provided below.

## Overview

The sample contains the following files: 

* A sample Express application, defined in the `src` directory. 
* A Dockerfile that builds the Express file as a Docker image. 
* A `build.yml` file for AWS CodeBuild that builds the image and pushes it to Amazon Elastic Container Registry (ECR). 
* A `release.yml` file for AWS CodeBuild that deploys the image stored in ECR to a Amazon Elastic Container Service (ECS) cluster. 

Users can use the `build.yml` and `release.yml` YAML files to create an AWS CodePipeline pipeline that compiles the latest application into a Docker image, which is then stored in an Amazon Elastic Container Registry (ECR) registry that is accessible to the user. The Express application itself is deployed onto AWS as a Docker container using Amazon Elastic Container Service (Amazon ECS) onto one of the user's available ECS clusters. 

### Sample Application

The sample application is a simple CRUD (Create/Read/Update/Delete) application that can store data either in memory or in an AWS DynamoDB database table. It is written as an Express application using TypeScript. When this application runs, it presents a set of REST API endpoints that other applications can call to store data. 

The application's data type, Item, contains two data fields: title and content. 

```typescript
type Item = {
  title: string;
  content: string;
};
```

The file `src/server.ts` declares the API's available endpoints. There are three sets of endpoints defined, each with slightly different functionality. 

| Endpoint Type  | Description |
| ------------- | ------------- |
| `/local-item`  | Stores the Item in memory. |
| `/dynamodb-item`  | Stores the item in an AWS DynamoDB table.  |
| `/postgres-item`  | Stores the item in a Postgres table.  |
| `/authenticated-dynamodb-item`  | Like `/dynamodb-item`, but requires that the API user be logged in with an Amazon Cognity Identity. All records saved with this API are saved with the user's Cognito ID. When performing read and update operations with this API, users can only access the records that they created. |

The server uses the same endpoint for all CRUD operations, distinguishing between them with HTTP verbs: 

| Endpoint Type  | Description |
| ------------- | ------------- |
| PUT  | Create  |
| GET | Read  |
| POST  | Update  |
| DELETE  | Delete  |

#### Running The Express Server Directly

To test out the sample application directly before you package it into a Dockerfile, clone this project locally, then run the following command on the command line in the root of this project: 

```
npm install
npm run build
node built/server.js
```

To test that the server is running, test its `/ping` endpoint from the command line: 

```
curl http://127.0.0.1/ping
```

If the server is running, this call will return an HTTP 200 (OK) result code. 

By default the server starts on port 80. You can change this to port 8000 by defining the environment variable `STAGE` and setting it to the value `local`. To bind to other ports, open the file `src/server.ts` and edit this line as needed: 

```typescript
const PORT = process.env.STAGE === "local" ? 8000 : 80;
```

#### Adding an Item in Memory

To add an item in memory, call the `/local-item` endpoint with an HTTP PUT verb. This can be done on Unix/MacOS systems using cUrl: 

```
curl -H "Content-Type: application/json" -X PUT -d '{"title":"my title", "content" : "my content"}' "http://127.0.0.1/item"
```

On Windows Powershell, use Invoke-WebRequest: 

```powershell
$item = @{
    title="my title"
    content="my content"
}
$json = $item |convertto-json
$response = Invoke-WebRequest 'http://127.0.0.1/local-item' -Method Put -Body $json -ContentType 'application/json' -UseBasicParsing
```

The return result will be the same item but with a UUID that serves as its index key into the in-memory dictionary where the entry is stored. 

#### Adding an Item to a DynamoDB Table

The sample application can store items as full JSON files in a DynamoDB table. The name of the table used is retrieved from the environment variable `TABLE_NAME`. 

To write to DynamoDB, the application must be running in a context in which it has been granted permissions to access the DynamoDB table.

### Dockerfile

The Dockerfile bundles the Express app (your app or the included sample app) onto a new Docker container image and runs the Express server.

The Docker image itself derives from [Bitnami's Node.js image](https://gallery.ecr.aws/bitnami/node), which is made freely available on the [Amazon ECR Public Gallery](https://gallery.ecr.aws/) and is based on minideb, a minimalist Linux distribution. The Dockerfile uses the Node Package Manager (NPM) to install the Node.js packages required for the Express application as defined in the package-lock.json file. It then copies over the application's files and runs the Express server (as defined in the `src/server.ts` file) on port 80 of the container. 

If you have Docker installed, you can build and try out the sample application locally. Open a command prompt to the directory containing the Dockerfile and run the following command: 

```
docker build -t tinystacks/express-crud-app:latest .
```

Once built, run the Docker command locally, mapping port 8080 on your host machine to port 80 on the container: 

```
docker run -p 8080:80 -d tinystacks/express-crud-app:latest
```

To test that the server is running, test its `/ping` endpoint from the command line. This time, you will change the port to 8080 to test that it's running from the running Docker container: 

```
curl http://127.0.0.1:8080/ping
```

If the server is running, this call will return an HTTP 200 (OK) result code. 

### Build Template

The `build.yml` file is an AWS CodeBuild file that builds your Dockerfile and publishes the output to an Amazon ECR registry. 

To publish to Amazon ECR, the build script first needs to obtain login credentials to the cluster. It does this using a combination of the AWS CLI command `aws ecr get-login-password` and the docker login command. After authentication, the script then builds your Docker image, names it, and tags it with the name `latest` to mark it as the most recent build. Finally, it performs a `docker push`, publishing the new Docker image to your Amazon ECR Docker repository.

```yml
version: 0.2
phases:
  build:
    commands:
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_ENDPOINT
      - docker build -t builtimage .
      - docker tag builtimage:latest $ECR_IMAGE_URL:latest
      - docker push $ECR_IMAGE_URL:latest
```

To run this in AWS CodeBuild, your build pipeline needs to define the following environment variables: 

* **ECR_ENDPOINT**: The name of the Amazon ECR repository to publish to. This variable takes the format: *<accountnumber>*.dkr.ecr.*<aws-region>*.amazonaws.com
* **ECR_IMAGE_URL**: The name of the Amazon ECR repository plus the name of the container you are publishing. This should take the format: *<accountnumber>*.dkr.ecr.*<aws-region>*.amazonaws.com/aws-docker-express

The variable `AWS_REGION` is a default global variable that will default to the same AWS region in which your build pipeline is defined. If you need to publish to an Amazon ECR repository in another region, modify this script to use a custom environment variable specifying the correct region. For more information on environment variables, see [Environment variables in build environments](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html) on the AWS Web site. 

### Release Template

The `release.yml` file is another AWS CodeBuild file that takes the build output from the `build.yml` files (a Docker container image in an Amazon ECR repository) and runs it within an Amazon ECS cluster to which the pipeline has access. 

After logging in to the ECR repository using the `docker login` command, the script pulls down the image that was compiled and changes its tag from the name of the previous build to the name of the new build. Once the container's label has been updated, the script updates a defined service in Amazon ECS that pulls its image from our published Docker container. 

```yaml
version: 0.2
phases:
  build:
    commands:
      - aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_ENDPOINT
      - docker pull $ECR_IMAGE_URL:$PREVIOUS_STAGE_NAME
      - docker tag $ECR_IMAGE_URL:$PREVIOUS_STAGE_NAME $ECR_IMAGE_URL:$STAGE_NAME
      - docker push $ECR_IMAGE_URL:$STAGE_NAME
      - aws ecs update-service --service $SERVICE_NAME --cluster $CLUSTER_ARN --force-new-deployment
```

In addition to the variables discussed for `build.yml`, `release.yml` requires several environment variables defined in order to run: 

* **PREVIOUS_STAGE_NAME**: The previous build number or build stage name. This should be the previous Docker image tag name generated by the previous build.
* **STAGE_NAME**: The current build number or build stage name you wish to use (e.g., `latest`). 
* **SERVICE_NAME**: The name of the Amazon ECS service to run. You will need to define this service yourself once you have the URI to your published container. 
* **CLUSTER_ARN**: The name of the cluster within your Amazon ECS service to which the release script will deploy the container. This should be the name of a custer that is running one or more instances of the service referenced by `SERVICE_NAME`. 

## Getting Started

### Existing Project

If you already have an existing Express application, you can use the core files included in this sample to run them on a Docker container in AWS. 

If your project is already Dockerized (i.e., it has its own Dockerfile), then simply copy over the `build.yml` and `release.yml` files into the root of your existing project. 

If your project is not Dockerized, you will also need to copy over the Dockerfile included in this sample. You may need to change the path to your application's source and to its configuration files (the `package*.json` and `tsconfig.json` files) in the Dockerfile itself to reflect your project's file paths: 

```Dockerfile
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
```

If your application uses a different port than port 80, you will also need to update the `EXPOSE` line in the Dockerfile to use a different port:

```Dockerfile
EXPOSE 80
```

## Known Limitations

The application was written for demonstration purposes and not for production use.
