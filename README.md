# [API] Central de Heróis
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/central-de-herois-api?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/central-de-herois-api)
[![mongoose](https://img.shields.io/badge/mongoose-5.13.3-green?style=flat-square&logo=mongo&logoColor=white)](https://mongoosejs.com/)
[![eslint](https://img.shields.io/badge/eslint-8.55.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/central-de-herois-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/central-de-herois-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/central-de-herois-api/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Central%20de%20Her%C3%B3is&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fcentral-de-herois-api%2Fmain%2FInsomnia_2021-07-24.json)

Allow users to register and log in, to create, update and delete heroes, list monsters and change a combat status, it also receive monsters occurrences and try to allocate heroes to fight with the monster. The app uses JWT for authentication.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [MongoDB](#mongodb)
    * [.env](#env)
* [Usage](#usage)
  * [Bearer Token](#bearer-token)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application use just one database: [MongoDB](https://www.mongodb.com/). For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

## MongoDB
Store heroes, monsters and the users utilized by the application. If for any reason you would like to create a MongoDB container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name central-de-herois-mongo -d -p 27017:27017 -d mongo
```

# .env
In this file you may configure your MongoDB's database connection, JWT settings and app's port. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`7d`
|MONGO_URL|MongoDB's server url.|`mongodb://mongo:27017/central-de-herois-mongo`
|MONSTER_WEBSOCKET|Socket's server url|`http://localhost:3000/central-de-herois`

```
$ yarn dev:server
```

# Tests
```
$ yarn test
```
