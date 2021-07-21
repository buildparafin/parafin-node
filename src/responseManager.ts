import { AxiosResponse } from 'axios'
import { CashAdvanceResponse, OfferCollectionResponse, ParafinResponse, PartnerResponse } from './types'

function baseResponse(response: AxiosResponse) {
  if (response == null
    || response == undefined
    || response.data == null 
    || response.data == undefined) {
    return null
  }

  const data = response.data
  const results = data.results

  if (!Array.isArray(results) || !results.length) {
    return null
  } else {
    return results
  }
}

function partnerResponse(partner: AxiosResponse): PartnerResponse {
  const results = baseResponse(partner)
  const response: PartnerResponse = {
    empty: true,
    name: null,
    slug: null
  } 

  if (results != null) {
    response.empty = false
    response.name = results[0].name
    response.slug = results[0].slug
  }

  return response
}

function offerCollectionResponse(offerCollection: AxiosResponse): OfferCollectionResponse {
  const results = baseResponse(offerCollection)
  const response: OfferCollectionResponse = {
    empty: true,
    approvalAmount: null
  } 

  if (results != null) {
    const openCollection = results.filter(element => element.open)
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
    outstandingAmount: null,
    paidAmount: null,
    estimatedPayoffDate: null,
    verified: null
  } 

  if (results != null) {
    // We assume here they always have one active cash advance at a time
    const cashAdvance = results[0]

    const totalAmount: number = +cashAdvance.total_repayment_amount
    const paidAmount: number = +cashAdvance.paid_amount
    const outstandingAmount = totalAmount - paidAmount

    response.empty = false
    response.outstandingAmount = String(outstandingAmount)
    response.paidAmount = cashAdvance.paid_amount
    response.estimatedPayoffDate = cashAdvance.estimated_repayment_date,
    response.verified = cashAdvance.verified
  }

  return response
}

function createParafinResponse(
  partner: PartnerResponse,
  offerCollection: OfferCollectionResponse,
  cashAdvance: CashAdvanceResponse
): ParafinResponse {
  const response: ParafinResponse = {
    id: "default",
    opted: false,
    name: partner.name,
    slug: partner.slug,
    approvalAmount: offerCollection.approvalAmount,
    outstandingAmount: cashAdvance.outstandingAmount,
    paidAmount: cashAdvance.paidAmount,
    estimatedPayoffDate: cashAdvance.estimatedPayoffDate,
    verified: cashAdvance.verified,
    empty: (partner.empty && offerCollection.empty && cashAdvance.empty)
  } 

  return response
}

export { 
  partnerResponse,
  offerCollectionResponse,
  cashAdvanceResponse,
  createParafinResponse
}
