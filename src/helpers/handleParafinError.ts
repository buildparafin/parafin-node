import { defaultDisplayMessage } from '../responses/ParafinError'
import { ParafinError } from '../responses/ParafinError'

export function handleParafinError(error: any): ParafinError {
  if (error != null && error != undefined && error.response) {
    return new ParafinError({
      error_type: 'API_ERROR_RESPONSE',
      status_code: error.response.status,
      status_text: String(error.response.statusText),
      error_message: String(error.response.data),
      display_message: defaultDisplayMessage,
    })
  } else if (error != null && error != undefined && error.request) {
    return new ParafinError({
      error_type: 'API_ERROR_REQUEST',
      error_message: 'The request was made but no response was received',
      display_message: defaultDisplayMessage,
    })
  } else {
    return new ParafinError({
      error_type: 'API_ERROR_GENERIC',
      error_message: 'Generic Parafin error',
      display_message: defaultDisplayMessage,
    })
  }
}
