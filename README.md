# [API] Central de Heróis
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/central-de-herois-api?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/central-de-herois-api)
[![mongodb](https://img.shields.io/badge/mongodb-5.9.2-13aa52?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![eslint](https://img.shields.io/badge/eslint-8.55.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/central-de-herois-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/central-de-herois-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/central-de-herois-api/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Central%20de%20Her%C3%B3is&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fcentral-de-herois-api%2Fmain%2FInsomnia_2024-11-28.json)

Allow users to register and log in, to create, update and delete heroes, list monsters and change a combat status, it also receive monsters occurrences and try to allocate heroes to fight with the monster. The app uses JWT for authentication.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [MongoDB](#mongodb)
    * [.env](#env)
* [Usage](#usage)
  * [Scripts](#scripts)
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

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Scripts
The application is shipped with a script to run a websocket server and emit monsters occurrences randomly. Run it by:
```shell
$ node ./scripts/websocket.js
```

## Bearer Token
Some routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
GET http://localhost:3333/heroes Authorization: Bearer <token>
```
> To get this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Routes
|route|HTTP Method|params|description|auth method
|:---|:---:|:---:|:---:|:---:
|`/users`|POST|Body with user `name`, `email` and `password`.|Create new user.|:x:
|`/sessions`|POST|Body with user `email` and `password`.|Authenticates user and return a Bearer Token.|:x:
|`/heroes`|GET| - |Return all heroes.|Bearer
|`/heroes`|POST|Body with hero `name`, `latitude`, `longitude`, `rank`, `status`  and `description`|Create a new hero.|Bearer
|`/heroes/:id`|PUT|Path param with hero `id`. Body with hero `name`, `latitude`, `longitude`, `rank`, `status`  and `description`|Update an existing hero.|Bearer
|`/heroes/:id`|DELETE|Path param with hero `id`.|Delete an existing hero.|Bearer
|`/monsters`|GET|Query param with an optional monster `status`.|Return all monsters optionally filtered by status.|Bearer
|`/monsters/:id/defeated`|PUT|Path param with monster `id`. Body with an array of heroes with `id` and `status` (after the combat finished).|Update monster and hero(es) status.|Bearer

### Requests
* `POST /users`

Request body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456"
}
```

* `POST /sessions`

Request body:
```json
{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

* `POST /heroes`

Request body:
```json
{
  "name": "Saitama",
  "latitude": "79.1721",
  "longitude": "43.0377",
  "rank": "A",
  "status": "patrolling",
  "description": "The most powerful, but not recognized hero",
}
```

* `PUT /heroes/:id`

Request body:
```json
{
  "name": "Saitama",
  "latitude": "79.1721",
  "longitude": "43.0377",
  "rank": "A",
  "status": "patrolling",
  "description": "The most powerful, but not recognized hero",
}
```

* `PUT /monsters/:id/defeated`

Request body:
```json
{
  "heroes": [
    {
      "_id": "3f7d0f46-9349-4e20-bcea-80b7e9fdd839",
      "status": "out_of_combat"
    },
    {
      "_id": "83916f30-59e1-4a57-abb0-396d921169e5",
      "status": "resting"
    }
  ]
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
