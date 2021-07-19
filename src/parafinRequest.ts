import axios from 'axios'
import { type } from 'ramda'
import { ParafinError } from './ParafinError'

function rejectWithParafinError(res: any) {
  if (type(res.data) === 'Object') {
    res.data.status_code = res.status;
    return new ParafinError(res.data)
  }

  // Unknown body type returned, return a standard API_ERROR
  return new ParafinError({
      error_type: 'API_ERROR',
      status_code: res.status,
      error_code: 'INTERNAL_SERVER_ERROR',
      error_message: String(res.data),
    })
}

function handleApiResponse(resolve: any, reject: unknown, res: any) {
  const body = res.data;

  if (res != null && type(body) === "Object") {
    body.status_code = res.status;
  }

  if (res.status === 200) {
    console.log(body)
  } else if (res.status === 210) {
    console.log(body)
  } else {
    return rejectWithParafinError(res);
  }
}

function parafinRequest<T>(uri: string, clientRequestOptions?: unknown): void {
  // const DEFAULT_TIMEOUT_IN_MILLIS = 10 * 60 * 1000;

  axios
    .get<T>(uri)
    .then((res) => {
      handleApiResponse(null, null, res);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response)
        return rejectWithParafinError(error.response);
      } else {
        return error
      }
    })
}

export { parafinRequest }
