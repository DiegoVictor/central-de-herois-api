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

Allow users to register and log in, to create, update and delete heroes, list monsters and change a combat status. The app uses JWT for authentication.

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

# Databases
The application use one databases: MongoDB. For the fastest setup is recommended to use docker, see how to do it below. For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

## MongoDB
If for any reason you would like to create a MongoDB container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name iheroes-mongo -d -p 27017:27017 -d mongo
```

# .env
Rename the `.env.example` to `.env` then just update with yours settings.

# Start Up
```
$ yarn dev:server
```

# Tests
```
$ yarn test
```
