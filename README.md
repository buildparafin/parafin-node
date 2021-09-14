# parafin-node [![Build](https://github.com/buildparafin/parafin-node/actions/workflows/build.yml/badge.svg)](https://github.com/buildparafin/parafin-node/actions/workflows/build.yml)

A node.js client library for the [Parafin API][2].

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
parafinClient.partner()

// Receive business information
parafinClient.businessCore()

// Receive offer collection information
parafinClient.offerCollection()

// Receive cash advance information
parafinClient.cashAdvance()

// Receive optIn information
parafinClient.optIn()

// OptInRequest object for posting an opt in
const accountManager: parafin.AccountManager {
  name: 'John Doe',
  email: 'jdoe@mygym.com'
}

const data: parafin.OptInRequest = {
  businessExternalId: 'externalId001',
  businessName: 'The Chiseled Jalapeño',
  ownerFirstName: 'John',
  ownerLastName: 'Doe',
  accountManagers: [
    accountManager
  ],
  routingNumber: '12345678',
  accountNumberLastFour: '0000',
  email: 'jdoe@mygym.com',
  postalCode: '12345'
}

// Post optIn information
parafinClient.postOptIn(data: OptInRequest)

// OptOutRequest object for posting an opt out
const data: parafin.OptOutRequest = {
  businessExternalId: string
}

// Post optOut information
parafinClient postOptOut(data: OptOutRequest)
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

## Support
Open an [issue][4]!

## License
[MIT][5]

[1]: https://parafin.com
[2]: https://docs.parafin.com
[3]: https://github.com/buildparafin/react-parafin-elements#readme
[4]: https://github.com/buildparafin/parafin-node/issues/new
[5]: https://github.com/buildparafin/parafin-node/blob/main/LICENSE
