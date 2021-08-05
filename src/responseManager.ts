import { AxiosResponse } from 'axios'
import {
  BusinessResponse,
  CashAdvanceResponse,
  OfferCollectionResponse,
  OptInResponse,
  ParafinResponse,
  PartnerResponse,
  PostResponse
} from './types'

function baseResponse(response: AxiosResponse) {
  if (
    response == null ||
    response == undefined ||
    response.data == null ||
    response.data == undefined
  ) {
    return null
  }

  const data = response.data
  const results = data.results

  return results
}

function partnerResponse(partner: AxiosResponse): PartnerResponse {
  const results = baseResponse(partner)
  const response: PartnerResponse = {
    empty: true,
    partnerName: null,
    partnerSlug: null
  }

  if (results != null && results.length > 0) {
    response.empty = false
    response.partnerName = results[0].name
    response.partnerSlug = results[0].slug
  }

  return response
}

function businessResponse(business: AxiosResponse): BusinessResponse {
  const results = baseResponse(business)
  const response: BusinessResponse = {
    empty: true,
    businessExternalId: null
  }

  if (results != null && results.length > 0) {
    response.empty = false
    response.businessExternalId = results[0].external_id
  }

  return response
}

function offerCollectionResponse(
  offerCollection: AxiosResponse
): OfferCollectionResponse {
  const results = baseResponse(offerCollection)
  const response: OfferCollectionResponse = {
    empty: true,
    approvalAmount: null
  }

  if (results != null && results.length > 0) {
    const openCollection = results.filter((element: any) => element.open)
    if (!openCollection.length) {
      return response
    }

    const openOffers = openCollection[0].offers
    if (!openOffers.length) {
      return response
    }

    const chunks = openOffers[0].chunks
    if (!chunks.length) {
      return response
    }

    // The chunks are already sorted
    const maxAmountRange = chunks[chunks.length - 1].amount_range
    if (!maxAmountRange.length) {
      return response
    }

    response.empty = false
    response.approvalAmount = maxAmountRange[1]
  }

  return response
}

function cashAdvanceResponse(cashAdvance: AxiosResponse): CashAdvanceResponse {
  const results = baseResponse(cashAdvance)
  const response: CashAdvanceResponse = {
    empty: true,
    acceptedAmount: null,
    outstandingAmount: null,
    paidAmount: null,
    estimatedPayoffDate: null,
    verified: null
  }

  if (results != null && results.length > 0) {
    const outstandingAdvances = results.filter(
      (element: any) => element.state === 'outstanding'
    )
    if (!outstandingAdvances.length) {
      return response
    }

    const cashAdvance = outstandingAdvances[0]
    const totalAmount: number = +cashAdvance.total_repayment_amount
    const paidAmount: number = +cashAdvance.paid_amount
    const outstandingAmount = totalAmount - paidAmount

    response.empty = false
    response.acceptedAmount = cashAdvance.amount
    response.outstandingAmount = String(outstandingAmount)
    response.paidAmount = cashAdvance.paid_amount
    response.estimatedPayoffDate = cashAdvance.estimated_repayment_date
    response.verified = cashAdvance.verified
  }

  return response
}

function optInResponse(optIn: AxiosResponse): OptInResponse {
  const results = baseResponse(optIn)
  const response: OptInResponse = {
    empty: true,
    opted: null
  }

  if (results != null) {
    response.empty = false
    if (results.length > 0) {
      response.opted = true
    } else {
      response.opted = false
    }
  }

  return response
}

function postResponse(postResponse: AxiosResponse): PostResponse {
  const response: PostResponse = {
    status: 0,
    statusText: '',
    data: ''
  }

  if (postResponse == null || postResponse == undefined) {
    return response
  }

  response.status = postResponse.status
  response.statusText = postResponse.statusText
  response.data = postResponse.data

  return response
}

function createParafinResponse(
  partner: PartnerResponse,
  business: BusinessResponse,
  offerCollection: OfferCollectionResponse,
  cashAdvance: CashAdvanceResponse,
  optIn: OptInResponse
): ParafinResponse {
  const response: ParafinResponse = {
    opted: optIn.opted,
    businessExternalId: business.businessExternalId,
    partnerName: partner.partnerName,
    partnerSlug: partner.partnerSlug,
    approvalAmount: offerCollection.approvalAmount,
    acceptedAmount: cashAdvance.acceptedAmount,
    outstandingAmount: cashAdvance.outstandingAmount,
    paidAmount: cashAdvance.paidAmount,
    estimatedPayoffDate: cashAdvance.estimatedPayoffDate,
    verified: cashAdvance.verified,
    empty: partner.empty && offerCollection.empty && cashAdvance.empty
  }

  return response
}

export {
  partnerResponse,
  businessResponse,
  offerCollectionResponse,
  cashAdvanceResponse,
  optInResponse,
  postResponse,
  createParafinResponse
}
