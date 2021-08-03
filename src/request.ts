import axios, { AxiosResponse } from 'axios'
import {
  businessResponse,
  cashAdvanceResponse,
  createParafinResponse,
  offerCollectionResponse,
  partnerResponse,
  optInResponse
} from './responseManager'
import { BasicRequest, ClientConfig, ParafinResponse } from './types'

// TODO: Add later handling of the response
// function rejectWithParafinError(res: any) {
//   if (type(res.data) === 'Object') {
//     res.data.status_code = res.status;
//     return new ParafinError(res.data)
//   }

//   // Unknown body type returned, return a standard API_ERROR
//   return new ParafinError({
//       error_type: 'API_ERROR',
//       status_code: res.status,
//       error_code: 'INTERNAL_SERVER_ERROR',
//       error_message: String(res.data),
//     })
// }

// function handleApiResponse(resolve: any, reject: unknown, res: AxiosResponse): any {
//   const body = res.data;

//   console.log(body)

//   if (res != null && type(body) === "Object") {
//     body.status_code = res.status;
//   }

//   if (res.status === 200) {
//     return body
//   } else if (res.status === 210) {
//     return body
//   } else {
//     return rejectWithParafinError(res);
//   }
// }

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

  const result = axios.all(requests).then(
    axios.spread(
      (
        partner: AxiosResponse,
        businesses: AxiosResponse,
        offerCollection: AxiosResponse,
        cashAdvance: AxiosResponse,
        optIn: AxiosResponse
      ) => {
        const partnerTemp = partnerResponse(partner)
        const businessTemp = businessResponse(businesses)
        const offerTemp = offerCollectionResponse(offerCollection)
        const advanceTemp = cashAdvanceResponse(cashAdvance)
        const optInTemp = optInResponse(optIn)

        const parafinResponse = createParafinResponse(
          partnerTemp,
          businessTemp,
          offerTemp,
          advanceTemp,
          optInTemp
        )

        return parafinResponse
      }
    )
  )

  return result
}

async function get(endpoint: string, config: ClientConfig) {
  const response = await axios.get(`${config.environment}/${endpoint}`, {
    headers: {
      authorization: formatToken(config.token)
    }
  })

  return response
}

async function post(
  endpoint: string,
  config: ClientConfig,
  data: BasicRequest
) {
  const response = await axios.post(`${config.environment}/${endpoint}`, data, {
    headers: {
      authorization: formatToken(config.token)
    }
  })

  return response
}

export { get, post, getCombine }
