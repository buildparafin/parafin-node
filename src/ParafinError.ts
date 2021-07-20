import { ParafinErrorType } from './ParafinErrorType'

// ParafinError wraps API errors to implement the Error class.
class ParafinError extends Error {
  constructor(body: ParafinErrorType) {
    super(body.error_code)
    this.name = 'ParafinError'

    if (typeof body === 'object') {
      Object.assign(this, body)
    }
  }
}

export { ParafinError }
