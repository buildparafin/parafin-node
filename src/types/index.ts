export interface BasicResponse {
  empty: boolean
}

export interface PartnerResponse extends BasicResponse {
  name: string | null
  slug: string | null
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

export interface ParafinResponse extends 
PartnerResponse, 
OfferCollectionResponse, 
CashAdvanceResponse {
  opted: boolean
}

export type ClientConfig = {
  token: string
  environment: string
}

export const ParafinEnvironments = {
  production: 'https://api.parafin.com',
  development: 'https://api.dev.parafin.com',
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
