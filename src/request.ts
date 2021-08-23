import axios, { AxiosResponse } from 'axios'
import axiosRetry from 'axios-retry'
import caseConverter from 'axios-case-converter'

import {
  businessCoreResponse,
  cashAdvanceResponse,
  createParafinResponse,
  offerCollectionResponse,
  partnerResponse,
  optInResponse
} from './responseManager'

import {
  BasicRequest,
  ClientConfig,
  ParafinError,
  ParafinResponse
} from './types'

// axiosRetry(axios, { retries: 2, retryDelay: axiosRetry.exponentialDelay })

function throwParafinError(error: any) {
  if (error.response) {
    throw new ParafinError({
      error_type: 'API_ERROR',
      status_code: error.response.status,
      status_text: String(error.response.statusText),
      error_message: String(error.response.data)
    })
  } else if (error.request) {
    throw new ParafinError({
      error_type: 'API_ERROR',
      error_message: 'The request was made but no response was received'
    })
  }
}

function formatToken(token: string) {
  return `Bearer ${token}`
}

async function getCombine(
  config: ClientConfig,
  ...endpoints: string[]
): Promise<ParafinResponse> {
  const requests = endpoints.map((endpoint) =>
    axios.get(`${config.environment}/${endpoint}`, {
      headers: {
        authorization: formatToken(config.token)
      }
    })
  )

  const result = axios
    .all(requests)
    .then(
      axios.spread(
        (
          partner: AxiosResponse,
          businessCores: AxiosResponse,
          offerCollection: AxiosResponse,
          cashAdvance: AxiosResponse,
          optIn: AxiosResponse
        ) => {
          const partnerTemp = partnerResponse(partner)
          const businessCoreTemp = businessCoreResponse(businessCores)
          const offerTemp = offerCollectionResponse(offerCollection)
          const advanceTemp = cashAdvanceResponse(cashAdvance)
          const optInTemp = optInResponse(optIn)

          const parafinResponse = createParafinResponse(
            partnerTemp,
            businessCoreTemp,
            offerTemp,
            advanceTemp,
            optInTemp
          )

          return parafinResponse
        }
      )
    )
    .catch(function (error) {
      if (error.response || error.request) {
        throwParafinError(error)
      }

      throw new Error(error.message)
    })

  return result
}

async function get(
  endpoint: string,
  config: ClientConfig
): Promise<AxiosResponse<any>> {
  const response = await axios
    .get(`${config.environment}/${endpoint}`, {
      headers: {
        authorization: formatToken(config.token)
      }
    })
    .catch(function (error) {
      if (error.response || error.request) {
        throwParafinError(error)
      }

      throw new Error(error.message)
    })

  return response
}

async function post(
  endpoint: string,
  config: ClientConfig,
  data: BasicRequest
): Promise<AxiosResponse<any>> {
  const client = caseConverter(axios.create())
  const response = await client
    .post(`${config.environment}/${endpoint}`, data, {
      headers: {
        authorization: formatToken(config.token)
      }
    })
    .catch(function (error) {
      if (error.response || error.request) {
        throwParafinError(error)
      }

      throw new Error(error.message)
    })

  return response
}

export { get, post, getCombine }
