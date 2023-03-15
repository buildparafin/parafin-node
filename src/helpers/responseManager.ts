import { AxiosResponse } from 'axios'
import {
  BusinessCoreResponse,
  BusinessDetailsResponse,
  CashAdvanceResponse,
  defaultDisplayMessage,
  OfferCollectionResponse,
  OptInResponse,
  ParafinError,
  ParafinResponse,
  PartnerResponse,
  PostResponse,
  ResultAsync
} from '../types'

export const promisify = <T>(value: T): Promise<T> =>
  new Promise((resolve, _reject) => {
    resolve(value)
  })

export const handleParafinError = (error: any): ParafinError =>
  new ParafinError({
    error_type: 'RESPONSE_MANAGER_ERROR',
    error_message: 'Unable to process a response',
    display_message: defaultDisplayMessage
  })

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

function partnerResponse(
  partner: AxiosResponse
): ResultAsync<PartnerResponse, ParafinError> {
  const results = baseResponse(partner)
  const response: PartnerResponse = {
    partnerId: null,
    partnerName: null,
    partnerSlug: null
  }

  if (results != null && results.length > 0) {
    response.partnerId = results[0].id
    response.partnerName = results[0].name
    response.partnerSlug = results[0].slug
  }

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function businessDetailsResponse(
  businessDetails: AxiosResponse
): ResultAsync<BusinessDetailsResponse[], ParafinError> {
  const results = baseResponse(businessDetails)
  const response: BusinessDetailsResponse[] = []

  if (results != null && results.length > 0) {
    results.map((bizDetails: any) => {
      response.push({
        legalBusinessName: bizDetails.legal_business_name,
        name: bizDetails.name
      })
    })
  }

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function businessCoreResponse(
  businessCores: AxiosResponse
): ResultAsync<BusinessCoreResponse[], ParafinError> {
  const results = baseResponse(businessCores)
  const response: BusinessCoreResponse[] = []

  if (results != null && results.length > 0) {
    results.map((bizCore: any) => {
      response.push({
        businessId: bizCore.id,
        externalId: bizCore.external_id
      })
    })
  }

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function getDiscountAmount(discount: any, offerChunk: any, amount: number) {
  const multiplier = discount.multiplier || discount.fee_multiplier_factor

  if (!discount || !multiplier) {
    return 0
  }

  const TYPE = discount.multiplier ? 'Multiplier' : 'Factor'

  const discountMultiplier =
    TYPE === 'Multiplier'
      ? +multiplier
      : +multiplier * +offerChunk.fee_multiplier

  return Math.round(discountMultiplier * amount)
}

function offerCollectionResponse(
  offerCollection: AxiosResponse
): ResultAsync<OfferCollectionResponse, ParafinError> {
  const results = baseResponse(offerCollection)
  const response: OfferCollectionResponse = {
    approvalAmount: null,
    discountAmount: null
  }

  if (results != null && results.length > 0) {
    const openCollection = results.filter((element: any) => element.open)
    if (!openCollection.length) {
      return ResultAsync.fromPromise(promisify(response), handleParafinError)
    }

    const openOffers = openCollection[0].offers
    if (!openOffers.length) {
      return ResultAsync.fromPromise(promisify(response), handleParafinError)
    }

    const amounts = openOffers.reduce(
      function (acc: any, openOffer: any) {
        const chunksLength = openOffer.chunks.length
        const offerChunk = openOffer.chunks[chunksLength - 1]

        if (chunksLength === 0 || offerChunk.amount_range.length < 2) {
          return 0
        }

        const maxOfferAmount = Number(offerChunk.amount_range[1])

        if (maxOfferAmount < acc.maxOfferAmount) {
          return acc
        }

        return {
          discountAmount: getDiscountAmount(
            results[0].discounts[0],
            offerChunk,
            maxOfferAmount
          ),
          maxOfferAmount
        }
      },
      {
        discountAmount: 0,
        maxOfferAmount: 0
      }
    )

    const { discountAmount, maxOfferAmount } = amounts

    if (maxOfferAmount === 0) {
      return ResultAsync.fromPromise(promisify(response), handleParafinError)
    }

    response.discountAmount = String(discountAmount)
    response.approvalAmount = String(maxOfferAmount)
  }

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function cashAdvanceResponse(
  cashAdvance: AxiosResponse
): ResultAsync<CashAdvanceResponse, ParafinError> {
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
    response.totalAdvances = results.length

    // The API returns only non-void states of cash advances
    const outstandingAdvances = results.filter(
      (element: any) => element.state === 'outstanding'
    )
    if (!outstandingAdvances.length) {
      return ResultAsync.fromPromise(promisify(response), handleParafinError)
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
  }

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function optInResponse(
  optIn: AxiosResponse
): ResultAsync<OptInResponse, ParafinError> {
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

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function postResponse(
  postResponse: AxiosResponse
): ResultAsync<PostResponse, ParafinError> {
  const response: PostResponse = {
    status: 0,
    statusText: '',
    data: ''
  }

  if (postResponse == null || postResponse == undefined) {
    return ResultAsync.fromPromise(promisify(response), handleParafinError)
  }

  response.status = postResponse.status
  response.statusText = postResponse.statusText
  response.data = postResponse.data

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

function parafinResponse(
  mergedResultAsync: [
    ResultAsync<PartnerResponse, ParafinError>,
    ResultAsync<BusinessCoreResponse[], ParafinError>,
    ResultAsync<BusinessDetailsResponse[], ParafinError>,
    ResultAsync<OfferCollectionResponse, ParafinError>,
    ResultAsync<CashAdvanceResponse, ParafinError>,
    ResultAsync<OptInResponse, ParafinError>
  ]
): ResultAsync<ParafinResponse, ParafinError> {
  const response: ParafinResponse = {
    opted: null,
    businessId: null,
    externalId: null,
    partnerId: null,
    partnerName: null,
    partnerSlug: null,
    approvalAmount: null,
    discountAmount: null,
    acceptedAmount: null,
    outstandingAmount: null,
    paidAmount: null,
    estimatedPayoffDate: null,
    verified: null,
    totalAdvances: null,
    legalBusinessName: null,
    name: null
  }

  mergedResultAsync[0].then((res) => {
    if (res.isOk()) {
      response.partnerId = res.value.partnerId
      response.partnerName = res.value.partnerName
      response.partnerSlug = res.value.partnerSlug
    }
  })

  mergedResultAsync[1].then((res) => {
    if (res.isOk()) {
      response.businessId = res.value[0].businessId
      response.externalId = res.value[0].externalId
    }
  })

  mergedResultAsync[2].then((res) => {
    if (res.isOk()) {
      if (res.value.length > 0) {
        response.legalBusinessName = res.value[0].legalBusinessName
        response.name = res.value[0].name
      }
    }
  })

  mergedResultAsync[3].then((res) => {
    if (res.isOk()) {
      response.approvalAmount = res.value.approvalAmount
      response.discountAmount = res.value.discountAmount
    }
  })

  mergedResultAsync[4].then((res) => {
    if (res.isOk()) {
      response.acceptedAmount = res.value.acceptedAmount
      response.outstandingAmount = res.value.outstandingAmount
      response.paidAmount = res.value.paidAmount
      response.estimatedPayoffDate = res.value.estimatedPayoffDate
      response.verified = res.value.verified
      response.totalAdvances = res.value.totalAdvances
    }
  })

  mergedResultAsync[5].then((res) => {
    if (res.isOk()) {
      response.opted = res.value.opted
    }
  })

  return ResultAsync.fromPromise(promisify(response), handleParafinError)
}

export {
  partnerResponse,
  businessCoreResponse,
  businessDetailsResponse,
  offerCollectionResponse,
  cashAdvanceResponse,
  optInResponse,
  postResponse,
  parafinResponse,
  getDiscountAmount
}
