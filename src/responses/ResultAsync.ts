import { defaultDisplayMessage } from '.'
import { Result } from '../types/index'
import { Err } from './Err'
import { Ok } from './Ok'
import { ParafinError } from './ParafinError'

export class ResultAsync<T, E> implements Promise<Result<T, E>> {
  private _promise: Promise<Result<T, E>>

  constructor(res: Promise<Result<T, E>>) {
    this._promise = res
  }

  catch<TResult = never>(
    _onrejected?: ((reason: any) => TResult | Promise<TResult>) | null,
  ): Promise<Result<T, E> | TResult> {
    throw new ParafinError({
      error_type: 'RESULT_ASYNC_ERROR',
      error_message: 'Catch statement was triggered',
      display_message: defaultDisplayMessage,
    })
  }

  finally(_onfinally?: (() => void) | null): Promise<Result<T, E>> {
    throw new ParafinError({
      error_type: 'RESULT_ASYNC_ERROR',
      error_message: 'Finally statement was triggered',
      display_message: defaultDisplayMessage,
    })
  }
  [Symbol.toStringTag]!: string

  static fromSafePromise<T, E>(promise: Promise<T>): ResultAsync<T, E> {
    const newPromise = promise.then((value: T) => new Ok<T, E>(value))

    return new ResultAsync(newPromise)
  }

  static fromPromise<T, E>(promise: Promise<T>, errorFn: (e: any) => E): ResultAsync<T, E> {
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
      }),
    )
  }

  mapErr<U>(f: (e: E) => U | Promise<U>): ResultAsync<T, U> {
    return new ResultAsync(
      this._promise.then(async (res: Result<T, E>) => {
        if (res.isOk()) {
          return new Ok<T, U>(res.value)
        }

        return new Err<T, U>(await f(res.error))
      }),
    )
  }

  async unwrapOr(t: T): Promise<T> {
    return this._promise.then((res) => res.unwrapOr(t))
  }

  then<A, B>(
    successCallback?: (res: Result<T, E>) => A | Promise<A>,
    failureCallback?: (reason: unknown) => B | Promise<B>,
  ): Promise<A | B> {
    return this._promise.then(successCallback, failureCallback)
  }

  andThen<U, F>(f: (t: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F> {
    return new ResultAsync(
      this._promise.then((res) => {
        if (res.isErr()) {
          return new Err<U, E>(res.error)
        }

        const newValue = f(res.value)

        return newValue instanceof ResultAsync ? newValue._promise : newValue
      }),
    )
  }
}
