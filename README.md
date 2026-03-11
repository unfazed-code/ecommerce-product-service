

## Description

Coding assignment - Ecommerce product backend service

## Default local environment variables

```env
PRODUCT_MICROSERVICE_HOST=localhost
PRODUCT_MICROSERVICE_HTTP_PORT=3000
PRODUCT_MICROSERVICE_TCP_PORT=3001
TEST_PRODUCT_MICROSERVICE_HTTP_PORT=3002
TEST_PRODUCT_MICROSERVICE_TCP_PORT=3003

MYSQL_HOST=mysql #internal docker network host name
MYSQL_ROOT_PASSWORD=root-password
MYSQL_USER=mysql-user
MYSQL_PASSWORD=mysql-password
MYSQL_DATABASE=ecommerce
TEST_MYSQL_HOST=localhost
TEST_MYSQL_DATABASE=ecommerce_test  #for local test database
```

## Project setup (With Docker)

make sure the file init-databases.sql creates the same  MYSQL_DATABASE and TEST_MYSQL_DATABASE as in the .env file

```bash
$ cp .env.example .env
$ npm install
$ docker compose up --watch --build
```

The server should start listening for http requests on port **3000** (http://localhost:3000) and tcp rpc requests on port **3001**

Api doc should be available on route path **/product-api-doc** and accessible 
with this link http://localhost:3000/product-api-doc

## Project setup (Without Docker)

```bash
$ cp .env
$ cp .env.example
$ npm install
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

Start local docker database instance (or ignore if using another mysql database)

```bash
$ docker compose up mysql
```

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
