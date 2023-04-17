import axios, { AxiosResponse } from 'axios'
import caseConverter from 'axios-case-converter'

import {
  businessCoreResponse,
  businessDetailsResponse,
  cashAdvanceResponse,
  offerCollectionResponse,
  partnerResponse,
  optInResponse,
  businessGroupsResponse
} from './responseManager'

import {
  BasicRequest,
  BusinessCoreResponse,
  BusinessDetailsResponse,
  BusinessGroupsResponse,
  CashAdvanceResponse,
  ClientConfig,
  handleParafinError,
  OfferCollectionResponse,
  OptInResponse,
  ParafinError,
  PartnerResponse,
  ResultAsync
} from '../types'

function formatToken(token: string) {
  return `Bearer ${token}`
}

function combine(
  config: ClientConfig,
  params: BasicRequest,
  ...endpoints: string[]
): ResultAsync<
  [
    ResultAsync<PartnerResponse, ParafinError>,
    ResultAsync<BusinessCoreResponse[], ParafinError>,
    ResultAsync<BusinessDetailsResponse[], ParafinError>,
    ResultAsync<OfferCollectionResponse, ParafinError>,
    ResultAsync<CashAdvanceResponse, ParafinError>,
    ResultAsync<OptInResponse, ParafinError>,
    ResultAsync<BusinessGroupsResponse, ParafinError>
  ],
  ParafinError
> {
  const requests = endpoints.map((endpoint) =>
    axios.get(`${config.environment}/${endpoint}`, {
      params,
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
        businessDetails: AxiosResponse,
        offerCollection: AxiosResponse,
        cashAdvance: AxiosResponse,
        optIn: AxiosResponse,
        businessGroups: AxiosResponse
      ) => {
        const merge: [
          ResultAsync<PartnerResponse, ParafinError>,
          ResultAsync<BusinessCoreResponse[], ParafinError>,
          ResultAsync<BusinessDetailsResponse[], ParafinError>,
          ResultAsync<OfferCollectionResponse, ParafinError>,
          ResultAsync<CashAdvanceResponse, ParafinError>,
          ResultAsync<OptInResponse, ParafinError>,
          ResultAsync<BusinessGroupsResponse, ParafinError>
        ] = [
          partnerResponse(partner),
          businessCoreResponse(businessCores),
          businessDetailsResponse(businessDetails),
          offerCollectionResponse(offerCollection),
          cashAdvanceResponse(cashAdvance),
          optInResponse(optIn),
          businessGroupsResponse(businessGroups)
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
