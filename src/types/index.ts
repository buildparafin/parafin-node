export interface BasicResponse {}

export interface PartnerResponse extends BasicResponse {
  partnerName: string | null
  partnerSlug: string | null
}

export interface BusinessCoreResponse extends BasicResponse {
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

export class ParafinError extends Error {
  constructor(body: ParafinErrorType) {
    super(body.status_text)
    this.name = 'ParafinError'

    if (typeof body === 'object') {
      Object.assign(this, body)

      if (body.status_code != undefined) {
        const statusCodeString = body.status_code
        const message = statusCodeToDisplayMessage.get(statusCodeString)

        if (message != undefined) {
          body.display_message = message
        } else {
          body.display_message = defaultDisplayMessage
        }
      }
    }
  }
}

export interface ParafinErrorType {
  error_type: string
  error_message: string
  status_code?: number
  status_text?: string
  display_message?: string
}

const defaultDisplayMessage =
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

export const environment = {
  production: 'https://api.parafin.com',
  development: 'https://api.dev.parafin.com'
}
