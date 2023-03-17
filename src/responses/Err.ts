import { Ok } from './Ok'
import { Result } from '../types/index'
import { err } from '.'

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
