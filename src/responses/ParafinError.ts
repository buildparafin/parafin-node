import { ParafinErrorType } from '../types'

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

  name!: string
  message!: string
  error_message: string
  error_type: string
  display_message: string
  status_code?: number | undefined
  status_text?: string | undefined
}
