export interface BasicResponse {
  empty: boolean
}

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

export interface AccountManager {
  name: string
  email: string
}

export interface PostResponse {
  status: number
  statusText: string
  data: string
}

export type ClientConfig = {
  token: string
  environment: string
}

export class ParafinError extends Error {
  constructor(body: ParafinErrorType) {
    super(body.error_code)
    this.name = 'ParafinError'

    if (typeof body === 'object') {
      Object.assign(this, body)
    }
  }
}

export type ParafinErrorType = {
  error_type: string
  status_code: string
  error_code: string
  error_message?: string
  display_message?: string
  request_id?: string
}

export const environment = {
  production: 'https://api.parafin.com',
  development: 'https://api.dev.parafin.com'
}
