# parafin-node [![Build](https://github.com/buildparafin/parafin-node/actions/workflows/build.yml/badge.svg)](https://github.com/buildparafin/parafin-node/actions/workflows/build.yml)

A node.js client library for the Parafin API.

## Getting started

The module supports all Parafin API endpoints.  For complete information about the API, head
to the docs. All endpoints require a valid `client_id` and `secret` to access and are 
accessible from a valid instance of a Parafin client object:

```javascript
import * as parafin from './parafin'

const parafinClient = new parafin.Client({
  token: token,
  environment: parafin.environment.development,
})

// Example endpoint
parafinClient.partner().then((data: any) => console.log(data))
```

The `environment` parameter dictates which Parafin API environment you will access. Values are:
- `parafin.environment.production` - production use, makes requests on https://api.parafin.com
- `parafin.environment.development` - use for integration development and testing, makes requests on https://api.dev.parafin.com

## Methods

Once an instance of the client has been created you can use the following methods:
```javascript
// Receive a combined payload
parafinClient.data()

// Receive partner information
parafinClient.partners()

// Receive business information
parafinClient.businesses()

// Receive offer collection information
parafinClient.offerCollection()

// Receive cash advance information
parafinClient.cashAdvance()

// Receive optIn information
parafinClient.optIn()

// Post optIn information
parafinClient.postOptIn()
```

## Install

```console
npm i parafin-node
```

## Build

```console
npm run build
```

## Lint

```console
npm run lint
```

## Local Run

```console
npx ts-node src/parafin.ts
```
