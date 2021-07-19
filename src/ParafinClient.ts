import { any, equals, is, isNil, values } from 'ramda'

import { parafinEnvironments } from './parafinEnvironments'
import { parafinRequest } from './parafinRequest'
import { ClientConfig } from './ClientConfig'

// Default version of Parafin API, if not specified by the client.
const DEFAULT_VERSION = '2021-07-01';

function Client(this: any, configs: ClientConfig) {
  if (!is(Object, configs)) {
    throw new Error(
      'Unexpected parameter type. ' +
        'Refer to github.com/buildparafin/parafin-node ' +
        'for how to create a Parafin client.',
    )
  }

  if (isNil(configs.clientId)) {
    throw new Error('Missing Parafin "clientId"')
  }

  if (isNil(configs.secret)) {
    throw new Error('Missing Parafin "secret"')
  }

  if (!any(equals(configs.environment), values(parafinEnvironments))) {
    throw new Error('Invalid Parafin environment')
  }

  if (arguments.length > 1) {
    throw new Error('Too many arguments to constructor')
  }

  this.client_id = configs.clientId
  this.secret = configs.secret
  this.environment = configs.environment

  if (configs.options == null) {
    configs.options = {}
  }

  if (configs.options.version == null) {
    configs.options.version = DEFAULT_VERSION;
  }

  this.client_request_opts = configs.options;
}

// Test purpose
type ResponseA = {
  status: string,
  data: subA
  message: string,
}

// Test purpose
type subA = {
  id: number,
  employee_name: string,
  employee_salary: number,
  employee_age: number,
  profile_image: string
}

function makeRequest<T>(uri: string) {
  return parafinRequest<T>(uri)
}

// test
Client.prototype.test = makeRequest<ResponseA>('http://dummy.restapiexample.com/api/v1/employee/1')

// getOfferUrl
Client.prototype.getOfferUrl = makeRequest('/offer-url')

export { Client }
