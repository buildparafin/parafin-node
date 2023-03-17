import { Result } from '../types'
import { Err } from './Err'
import { ok } from '.'

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
