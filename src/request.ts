import axios from 'axios';
import {
  cashAdvanceResponse,
  createParafinResponse,
  offerCollectionResponse,
  partnerResponse,
} from './responseManager';
import { ClientConfig, ParafinResponse } from './types';

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
  return `Bearer ${token}`;
}

async function requestCombine(config: ClientConfig, ...endpoints: string[]): Promise<ParafinResponse> {
  const requests = endpoints.map((endpoint) =>
    axios.get(`${config.environment}/${endpoint}`, {
      headers: {
        authorization: formatToken(config.token),
      },
    }),
  );

  const result = axios.all(requests).then(
    axios.spread((partner, offerCollection, cashAdvance) => {
      const partnerTemp = partnerResponse(partner);
      const offerTemp = offerCollectionResponse(offerCollection);
      const advanceTemp = cashAdvanceResponse(cashAdvance);

      const parafinResponse = createParafinResponse(partnerTemp, offerTemp, advanceTemp);

      return parafinResponse;
    }),
  );

  return result;
}

async function request(endpoint: string, config: ClientConfig) {
  const response = await axios.get(`${config.environment}/${endpoint}`, {
    headers: {
      authorization: formatToken(config.token),
    },
  });

  return response;
}

export { request, requestCombine };
