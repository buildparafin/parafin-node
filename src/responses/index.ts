import { Result } from '../types'
import { Err } from './Err'
import { Ok } from './Ok'

export const ok = <T, E>(value: T): Result<T, E> => new Ok(value)

export const err = <T, E>(error: E): Result<T, E> => new Err(error)

export const returnOrThrow = <T, E>(result: Result<T, E>): Ok<T, E> => {
  if (result.isOk()) {
    return result
  } else {
    throw result
  }
}
