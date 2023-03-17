import { defaultDisplayMessage, statusCodeToDisplayMessage } from '.'
import { ParafinErrorType } from '../types'

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
