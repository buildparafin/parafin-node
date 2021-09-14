export interface BasicResponse {}

export interface PartnerResponse extends BasicResponse {
  partnerId: string | null
  partnerName: string | null
  partnerSlug: string | null
}

export interface BusinessCoreResponse extends BasicResponse {
  businessId: string | null
  externalId: string | null
}

export interface OfferCollectionResponse extends BasicResponse {
  approvalAmount: string | null
}

export interface CashAdvanceResponse extends BasicResponse {
  acceptedAmount: string | null
  outstandingAmount: string | null
  paidAmount: string | null
  estimatedPayoffDate: string | null
  verified: boolean | null
  totalAdvances: number | null
}

export interface OptInResponse extends BasicResponse {
  opted: boolean | null
}

export interface ParafinResponse
  extends PartnerResponse,
    BusinessCoreResponse,
    OfferCollectionResponse,
    CashAdvanceResponse,
    OptInResponse {}

export interface BasicRequest {}

export interface OptInRequest extends BasicRequest {
  businessExternalId: string
  businessName: string
  ownerFirstName: string
  ownerLastName: string
  accountManagers: AccountManager[]
  routingNumber: string
  accountNumberLastFour: string
  email: string
  postalCode: string
}

export interface OptOutRequest extends BasicRequest {
  businessExternalId: string
}

export interface AccountManager {
  name: string
  email: string
}

export interface PostResponse {
  status: number
  statusText: string
  data: string
}

export interface ClientConfig {
  token: string
  environment: string
}

export class ParafinError implements Error, ParafinErrorType {
  constructor(body: ParafinErrorType) {
    this.name = 'Parafin Error'
    this.message = body.error_message
    this.error_message = body.error_message
    this.error_type = body.error_type
    this.display_message = defaultDisplayMessage

    if (typeof body === 'object') {
      Object.assign(this, body)

      if (body.status_code != undefined) {
        const statusCodeString = body.status_code
        const message = statusCodeToDisplayMessage.get(statusCodeString)

        if (message != undefined) {
          this.display_message = message
        }
      }
    }
  }

  name: string
  message: string
  error_message: string
  error_type: string
  display_message: string
  status_code?: number | undefined
  status_text?: string | undefined
}

export interface ParafinErrorType {
  error_message: string
  error_type: string
  display_message: string
  status_code?: number
  status_text?: string
}

export const defaultDisplayMessage =
  'Something has gone wrong in our end! We are looking into it.'
const statusCodeToDisplayMessage = new Map<number, string>([
  [200, 'Success!'],
  [201, 'Success!'],
  [202, 'Success!'],
  [400, 'You did not provide the right data.'],
  [401, 'You are not authorized for this functionality.'],
  [403, 'You are not authorized for this functionality.'],
  [404, 'Oops! this is most likely our fault, we are looking into it.'],
  [408, 'It seems like there is a network issue. Give it another try!'],
  [500, 'Our server is down, we are looking into it.'],
  [501, 'Our server is down, we are looking into it.'],
  [502, 'Our server is down, we are looking into it.'],
  [503, 'Our server is down, we are looking into it.'],
  [504, 'Our server is down, we are looking into it.']
])

export function handleParafinError(error: any): ParafinError {
  if (error != null && error != undefined && error.response) {
    return new ParafinError({
      error_type: 'API_ERROR_RESPONSE',
      status_code: error.response.status,
      status_text: String(error.response.statusText),
      error_message: String(error.response.data),
      display_message: defaultDisplayMessage
    })
  } else if (error != null && error != undefined && error.request) {
    return new ParafinError({
      error_type: 'API_ERROR_REQUEST',
      error_message: 'The request was made but no response was received',
      display_message: defaultDisplayMessage
    })
  } else {
    return new ParafinError({
      error_type: 'API_ERROR_GENERIC',
      error_message: 'Generic Parafin error',
      display_message: defaultDisplayMessage
    })
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>

export const ok = <T, E>(value: T): Result<T, E> => new Ok(value)

export const err = <T, E>(error: E): Result<T, E> => new Err(error)

export const returnOrThrow = <T, E>(result: Result<T, E>): Ok<T, E> => {
  if (result.isOk()) {
    return result
  } else {
    throw result
  }
}

export class ResultAsync<T, E> implements Promise<Result<T, E>> {
  private _promise: Promise<Result<T, E>>

  constructor(res: Promise<Result<T, E>>) {
    this._promise = res
  }

  catch<TResult = never>(
    _onrejected?: ((reason: any) => TResult | Promise<TResult>) | null
  ): Promise<Result<T, E> | TResult> {
    throw new ParafinError({
      error_type: 'RESULT_ASYNC_ERROR',
      error_message: 'Catch statement was triggered',
      display_message: defaultDisplayMessage
    })
  }

  finally(_onfinally?: (() => void) | null): Promise<Result<T, E>> {
    throw new ParafinError({
      error_type: 'RESULT_ASYNC_ERROR',
      error_message: 'Finally statement was triggered',
      display_message: defaultDisplayMessage
    })
  }
  [Symbol.toStringTag]: string

  static fromSafePromise<T, E>(promise: Promise<T>): ResultAsync<T, E> {
    const newPromise = promise.then((value: T) => new Ok<T, E>(value))

    return new ResultAsync(newPromise)
  }

  static fromPromise<T, E>(
    promise: Promise<T>,
    errorFn: (e: any) => E
  ): ResultAsync<T, E> {
    const newPromise = promise
      .then((value: T) => new Ok<T, E>(value))
      .catch((e) => new Err<T, E>(errorFn(e)))

    return new ResultAsync(newPromise)
  }

  map<A>(f: (t: T) => A | Promise<A>): ResultAsync<A, E> {
    return new ResultAsync(
      this._promise.then(async (res: Result<T, E>) => {
        if (res.isErr()) {
          return new Err<A, E>(res.error)
        }

        return new Ok<A, E>(await f(res.value))
      })
    )
  }

  mapErr<U>(f: (e: E) => U | Promise<U>): ResultAsync<T, U> {
    return new ResultAsync(
      this._promise.then(async (res: Result<T, E>) => {
        if (res.isOk()) {
          return new Ok<T, U>(res.value)
        }

        return new Err<T, U>(await f(res.error))
      })
    )
  }

  async unwrapOr(t: T): Promise<T> {
    return this._promise.then((res) => res.unwrapOr(t))
  }

  then<A, B>(
    successCallback?: (res: Result<T, E>) => A | Promise<A>,
    failureCallback?: (reason: unknown) => B | Promise<B>
  ): Promise<A | B> {
    return this._promise.then(successCallback, failureCallback)
  }

  andThen<U, F>(
    f: (t: T) => Result<U, F> | ResultAsync<U, F>
  ): ResultAsync<U, E | F> {
    return new ResultAsync(
      this._promise.then((res) => {
        if (res.isErr()) {
          return new Err<U, E>(res.error)
        }

        const newValue = f(res.value)

        return newValue instanceof ResultAsync ? newValue._promise : newValue
      })
    )
  }
}

export class Ok<T, E> {
  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true
  }

  isErr(): this is Err<T, E> {
    return !this.isOk()
  }

  map<A>(f: (t: T) => A): Result<A, E> {
    return ok(f(this.value))
  }

  andThen<U, F>(f: (t: T) => Result<U, F>): Result<U, E | F> {
    return f(this.value)
  }

  unwrapOr(v: T): T {
    return v
  }
}

export class Err<T, E> {
  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false
  }

  isErr(): this is Err<T, E> {
    return !this.isOk()
  }

  mapErr<U>(f: (e: E) => U): Result<T, U> {
    return err(f(this.error))
  }

  andThen<U, F>(_f: (t: T) => Result<U, F>): Result<U, E | F> {
    return err(this.error)
  }

  unwrapOr(v: T): T {
    return v
  }
}

export const environment = {
  production: 'https://api.parafin.com',
  development: 'https://api.dev.parafin.com'
}
