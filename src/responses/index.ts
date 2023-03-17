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

export const defaultDisplayMessage = 'We are looking into this issue! Please try again later.'

export const statusCodeToDisplayMessage = new Map<number, string>([
  [200, 'Success!'],
  [201, 'Success!'],
  [202, 'Success!'],
  [400, 'The request was not formatted correctly.'],
  [401, 'You are not authorized for this functionality.'],
  [403, 'You are not authorized for this functionality.'],
  [404, 'Not found.'],
  [408, 'Request timed-out.'],
  [500, 'This is an issue on our end. We are looking into it!'],
  [501, 'This is an issue on our end. We are looking into it!'],
  [502, 'This is an issue on our end. We are looking into it!'],
  [503, 'This is an issue on our end. We are looking into it!'],
  [504, 'This is an issue on our end. We are looking into it!'],
])
