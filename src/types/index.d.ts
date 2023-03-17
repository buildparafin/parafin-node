import { Err } from '../responses/Err'
import { Ok } from '../responses/Ok'

export interface BasicResponse {}

export interface PartnerResponse extends BasicResponse {
  partnerId: string | null
  partnerName: string | null
  partnerSlug: string | null
}

export interface BusinessCoreResponse extends BasicResponse {
  businessId: string | null
  externalId: string | null
}

export interface BusinessDetailsResponse extends BasicResponse {
  legalBusinessName: string | null
  name: string | null
}

export interface OfferCollectionResponse extends BasicResponse {
  approvalAmount: string | null
  discountAmount: string | null
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
    BusinessDetailsResponse,
    OfferCollectionResponse,
    CashAdvanceResponse,
    OptInResponse {}

export type CashAdvanceState = 'no_offer' | 'offer' | 'pending' | 'advance' | null

export interface CashAdvanceStateResponse extends BasicResponse {
  businessExternalId: string
  state: CashAdvanceState
}

export interface BasicRequest {}

export interface OptInRequest extends BasicRequest {
  businessExternalId: string
  businessName: string
  ownerFirstName: string
  ownerLastName: string
  accountManagers?: AccountManager[]
  routingNumber?: string
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

export type Result<T, E> = Ok<T, E> | Err<T, E>

export interface ParafinErrorType {
  error_message: string
  error_type: string
  display_message: string
  status_code?: number
  status_text?: string
}
