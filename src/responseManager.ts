import { AxiosResponse } from 'axios'
import {
  BusinessCoreResponse,
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
    partnerName: null,
    partnerSlug: null
  }

  if (results != null && results.length > 0) {
    response.partnerName = results[0].name
    response.partnerSlug = results[0].slug
  }

  return response
}

function businessCoreResponse(
  businessCore: AxiosResponse
): BusinessCoreResponse {
  const results = baseResponse(businessCore)
  const response: BusinessCoreResponse = {
    externalId: null
  }

  if (results != null && results.length > 0) {
    response.externalId = results[0].external_id
  }

  return response
}

function offerCollectionResponse(
  offerCollection: AxiosResponse
): OfferCollectionResponse {
  const results = baseResponse(offerCollection)
  const response: OfferCollectionResponse = {
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

    const maxOfferAmount = Math.max.apply(
      Math,
      openOffers.map(function (openOffer: any) {
        const chunksLength = openOffer.chunks.length
        if (
          chunksLength === 0 ||
          openOffer.chunks[chunksLength - 1].amount_range.length < 2
        ) {
          return 0
        }
        return Number(
          openOffer.chunks[openOffer.chunks.length - 1].amount_range[1]
        )
      })
    )

    if (maxOfferAmount === 0) {
      return response
    }

    response.approvalAmount = String(maxOfferAmount)
  }

  return response
}

function cashAdvanceResponse(cashAdvance: AxiosResponse): CashAdvanceResponse {
  const results = baseResponse(cashAdvance)
  const response: CashAdvanceResponse = {
    acceptedAmount: null,
    outstandingAmount: null,
    paidAmount: null,
    estimatedPayoffDate: null,
    verified: null,
    totalAdvances: null
  }

  if (results != null && results.length > 0) {
    // The API returns only Non Void States of cash advances
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

    response.acceptedAmount = cashAdvance.amount
    response.outstandingAmount = String(outstandingAmount)
    response.paidAmount = cashAdvance.paid_amount
    response.estimatedPayoffDate = cashAdvance.estimated_repayment_date
    response.verified = cashAdvance.verified
    response.totalAdvances = results.length
  }

  return response
}

function optInResponse(optIn: AxiosResponse): OptInResponse {
  const results = baseResponse(optIn)
  const response: OptInResponse = {
    opted: null
  }

  if (results != null) {
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
  businessCore: BusinessCoreResponse,
  offerCollection: OfferCollectionResponse,
  cashAdvance: CashAdvanceResponse,
  optIn: OptInResponse
): ParafinResponse {
  const response: ParafinResponse = {
    opted: optIn.opted,
    externalId: businessCore.externalId,
    partnerName: partner.partnerName,
    partnerSlug: partner.partnerSlug,
    approvalAmount: offerCollection.approvalAmount,
    acceptedAmount: cashAdvance.acceptedAmount,
    outstandingAmount: cashAdvance.outstandingAmount,
    paidAmount: cashAdvance.paidAmount,
    estimatedPayoffDate: cashAdvance.estimatedPayoffDate,
    verified: cashAdvance.verified,
    totalAdvances: cashAdvance.totalAdvances
  }

  return response
}

export {
  partnerResponse,
  businessCoreResponse,
  offerCollectionResponse,
  cashAdvanceResponse,
  optInResponse,
  postResponse,
  createParafinResponse
}
