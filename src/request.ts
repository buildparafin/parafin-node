import axios, { AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'
import caseConverter from 'axios-case-converter'

import {
  businessCoreResponse,
  cashAdvanceResponse,
  parafinResponse,
  offerCollectionResponse,
  partnerResponse,
  optInResponse
} from './responseManager'

import {
  BasicRequest,
  BusinessCoreResponse,
  CashAdvanceResponse,
  ClientConfig,
  defaultDisplayMessage,
  Err,
  err,
  handleParafinError,
  OfferCollectionResponse,
  ok,
  Ok,
  OptInRequest,
  OptInResponse,
  ParafinError,
  ParafinResponse,
  PartnerResponse,
  Result,
  ResultAsync,
  returnOrThrow
} from './types'

// axiosRetry(axios, { retries: 2, retryDelay: axiosRetry.exponentialDelay })

function formatToken(token: string) {
  return `Bearer ${token}`
}

function merge(
  resultAsyncs: [
    ResultAsync<PartnerResponse, ParafinError>,
    ResultAsync<BusinessCoreResponse, ParafinError>,
    ResultAsync<OfferCollectionResponse, ParafinError>,
    ResultAsync<CashAdvanceResponse, ParafinError>,
    ResultAsync<OptInResponse, ParafinError>
  ]
): (
  | PartnerResponse
  | BusinessCoreResponse
  | OfferCollectionResponse
  | CashAdvanceResponse
  | OptInResponse
)[] {
  let results: (
    | PartnerResponse
    | BusinessCoreResponse
    | OfferCollectionResponse
    | CashAdvanceResponse
    | OptInResponse
  )[] = []

  resultAsyncs.forEach((element, index) => {
    element.then((res) => {
      if (res.isOk()) {
        results[index] = res.value
      }
    })
  })

  return results
}

function combine(
  config: ClientConfig,
  ...endpoints: string[]
): ResultAsync<
  [
    ResultAsync<PartnerResponse, ParafinError>,
    ResultAsync<BusinessCoreResponse, ParafinError>,
    ResultAsync<OfferCollectionResponse, ParafinError>,
    ResultAsync<CashAdvanceResponse, ParafinError>,
    ResultAsync<OptInResponse, ParafinError>
  ],
  ParafinError
> {
  const requests = endpoints.map((endpoint) =>
    axios.get(`${config.environment}/${endpoint}`, {
      headers: {
        authorization: formatToken(config.token)
      }
    })
  )

  const promiseMerge = axios.all(requests).then(
    axios.spread(
      (
        partner: AxiosResponse,
        businessCores: AxiosResponse,
        offerCollection: AxiosResponse,
        cashAdvance: AxiosResponse,
        optIn: AxiosResponse
      ) => {
        const merge: [
          ResultAsync<PartnerResponse, ParafinError>,
          ResultAsync<BusinessCoreResponse, ParafinError>,
          ResultAsync<OfferCollectionResponse, ParafinError>,
          ResultAsync<CashAdvanceResponse, ParafinError>,
          ResultAsync<OptInResponse, ParafinError>
        ] = [
          partnerResponse(partner),
          businessCoreResponse(businessCores),
          offerCollectionResponse(offerCollection),
          cashAdvanceResponse(cashAdvance),
          optInResponse(optIn)
        ]

        return merge
      }
    )
  )

  return ResultAsync.fromPromise(promiseMerge, handleParafinError)
}

function get(
  endpoint: string,
  config: ClientConfig
): ResultAsync<AxiosResponse<any>, ParafinError> {
  const request = axios.get(`${config.environment}/${endpoint}`, {
    headers: {
      authorization: formatToken(config.token)
    }
  })

  return ResultAsync.fromPromise(request, handleParafinError)
}

function post(
  endpoint: string,
  config: ClientConfig,
  data: BasicRequest
): ResultAsync<AxiosResponse<any>, ParafinError> {
  const client = caseConverter(axios.create())
  const request = client.post(`${config.environment}/${endpoint}`, data, {
    headers: {
      authorization: formatToken(config.token)
    }
  })

  return ResultAsync.fromPromise(request, handleParafinError)
}

export { get, post, combine }
