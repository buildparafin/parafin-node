import R from 'ramda';

import { parafinEnvironments } from './parafinEnvironments';
import { parafinRequest } from './parafinRequest'
import { ClientConfig } from './ClientConfig'; 

// Default version of Parafin API, if not specified by the client.
const DEFAULT_VERSION = '2021-07-01';

function Client(this: any, configs: ClientConfig) {
  if (!R.is(Object, configs)) {
    throw new Error('Unexpected parameter type. ' +
    'Refer to github.com/buildparafin/parafin-node ' +
    'for how to create a Parafin client.');
  }

  if (R.isNil(configs.clientId)) {
    throw new Error('Missing Parafin "clientId"');
  }

  if (R.isNil(configs.secret)) {
    throw new Error('Missing Parafin "secret"');
  }

  if (!R.any(R.equals(configs.environment), R.values(parafinEnvironments))) {
    throw new Error('Invalid Parafin environment');
  }

  if (arguments.length > 1) {
    throw new Error('Too many arguments to constructor');
  }

  this.client_id = configs.clientId;
  this.secret = configs.secret;
  this.environment = configs.environment;

  if (configs.options == null) {
    configs.options = {};
  }

  if (configs.options.version == null) {
    configs.options.version = DEFAULT_VERSION;
  }

  this.client_request_opts = configs.options;
}

// Private
var requestWithAccessToken = function(path: string) {
  return (access_token: string, options: any, callback: any) => {
    return this.prototype._authenticatedRequest({
      path: path,
      body: {
        access_token: access_token,
      }
    }, options, callback);
  };
};


Client.prototype._authenticatedRequest =
  function _authenticatedRequest(requestSpec: any, options: object, callback: any) {
    // check arguments
    if (typeof options === 'function') {
      callback = options;
      options = {};
    } else {
      requestSpec.body.options = options;
    }

    var context = R.merge({env: this.env}, {
      client_id: this.client_id,
      secret: this.secret,
    });

    return parafinRequest(context, requestSpec, this.client_request_opts, callback);
  };

// getOfferUrl
Client.prototype.getOfferUrl =
  requestWithAccessToken('/offer-url');

export {
  Client
};
