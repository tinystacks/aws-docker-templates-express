FROM public.ecr.aws/bitnami/node:15
COPY --from=public.ecr.aws/tinystacks/secret-env-vars-wrapper:latest-x86 /opt /opt
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.3.2-x86_64 /lambda-adapter /opt/extensions/lambda-adapter

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "/opt/tinystacks-secret-env-vars-wrapper", "node", "built/server.js" ]
