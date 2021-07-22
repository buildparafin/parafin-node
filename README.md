# parafin-node

A node.js client library for the Parafin API.

## Getting started

The module supports all Parafin API endpoints.  For complete information about the API, head
to the docs.

All endpoints require a valid `client_id` and `secret` to
access and are accessible from a valid instance of a Parafin `Client`:

```javascript
import * as parafin from './parafin'

const parafinClient = new parafin.Client({
  token: token,
  environment: parafin.ParafinEnvironments.development,
})

// Example endpoint
parafinClient.partner().then((data: any) => console.log(data))
```

The `environment` parameter dictates which Parafin API environment you will access. Values are:
- `parafin.ParafinEnvironments.production` - production use, makes requests on https://api.parafin.com
- `parafin.ParafinEnvironments.development` - use for integration development and testing, makes requests on https://api.dev.parafin.com

## Install

```console
$ npm i parafin-node
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
