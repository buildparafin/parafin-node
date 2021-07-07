import R from 'ramda';
import axios from 'axios';

import packageJson from '../package.json';
import { ParafinError } from './ParafinError';
import { wrapPromise } from './wrapPromise';

// Max timeout of ten minutes
var DEFAULT_TIMEOUT_IN_MILLIS = 10 * 60 * 1000;

var rejectWithParafinError = function (reject: any, res: any) {
  if (R.type(res.data) === 'Object') {
    res.data.status_code = res.status;
    return reject(new ParafinError(res.data));
  }

  // Unknown body type returned, return a standard API_ERROR
  return reject(new ParafinError({
    error_type: 'API_ERROR',
    status_code: res.status,
    error_code: 'INTERNAL_SERVER_ERROR',
    error_message: String(res.data),
  }));
};

var handleApiResponse = function (resolve: any, reject: any, res: any, isMfa: any) {
  var $body = res.data;

  if (res != null && R.type($body) === 'Object') {
    $body.status_code = res.status;
  }

  if (isMfa && res.status === 200) {
    return resolve([null, $body]);

  } else if (isMfa && res.status === 210) {
    return resolve([$body, null]);

  } else if (res.status === 200) {
    // extract request id from header for binary data,
    // i.e. mime type application/*
    if (res.headers['parafin-request-id'] != null &&
      res.headers['content-type'] != null &&
      res.headers['content-type'].indexOf('application') === 0) {
      return resolve({
        request_id: res.headers['parafin-request-id'],
        buffer: $body
      });
    }
    return resolve($body);

  } else {
    return rejectWithParafinError(reject, res);
  }
};

var parafinRequest = function (context: any, requestSpec: any, clientRequestOptions: any, callback: any) {
  var uri = context.env + requestSpec.path;
  var method = 'POST';
  var requestJSON = R.merge(R.dissoc('env', context), requestSpec.body);
  var headers = {
    'User-Agent': 'Parafin Node v' + packageJson.version,
    'Parafin-Version': '',
    'Parafin-Client-App': '',
  };

  if (clientRequestOptions.version != null) {
    headers['Parafin-Version'] = clientRequestOptions.version;
  }

  if (clientRequestOptions.clientApp != null) {
    headers['Parafin-Client-App'] = clientRequestOptions.clientApp;
  }

  // merge the default request options with the client specified options,
  // this allows for clients to supply extra options to the request function
  var requestOptions = R.merge({
    url: uri,
    method: method,
    data: requestJSON,
    headers: headers,
    timeout: DEFAULT_TIMEOUT_IN_MILLIS,
    responseType: requestSpec.binary ? 'arraybuffer' : 'json'
  }, clientRequestOptions);

  return wrapPromise(new Promise(function (resolve, reject) {
    axios(requestOptions)
      .then((res) => {
        handleApiResponse(resolve, reject, res,
          requestSpec.includeMfaResponse);
      })
      .catch((error) => {
        if (error.response) {
          return rejectWithParafinError(reject, error.response);
        } else {
          return reject(error);
        }
      });
  }), callback, clientRequestOptions);
};

export {
  parafinRequest
};
