import determineCashAdvanceState from './helpers/determineCashAdvanceState'
import { post, get, combine } from './helpers/request'
import {
  businessCoreResponse,
  businessDetailsResponse,
  cashAdvanceResponse,
  parafinResponse,
  offerCollectionResponse,
  optInResponse,
  partnerResponse,
  postResponse,
  promisify,
  handleParafinError,
} from './helpers/responseManager'
import {
  BusinessCoreResponse,
  BusinessDetailsResponse,
  CashAdvanceResponse,
  CashAdvanceStateResponse,
  ClientConfig,
  OfferCollectionResponse,
  OptInRequest,
  OptInResponse,
  OptOutRequest,
  ParafinErrorType,
  ParafinResponse,
  PartnerResponse,
  PostResponse,
} from './types'
import { ResultAsync } from './responses/ResultAsync'
import { defaultDisplayMessage, ParafinError } from './responses/ParafinError'
import { environment } from './helpers/environment'
import { returnOrThrow } from './responses'
import { Ok } from './responses/Ok'

class Client {
  config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  validateInput() {
    if (typeof this.config !== 'object' || this.config === null) {
      return new ParafinError({
        error_type: 'PARAFIN_CLIENT_CONFIG_ERROR',
        error_message:
          'Unexpected parameter type. ' +
          'Refer to github.com/buildparafin/parafin-node ' +
          'for how to create a Parafin client.',
        display_message: defaultDisplayMessage,
      })
    }

    if (
      this.config.environment !== environment.development ||
      this.config.environment !== environment.production
    ) {
      return new ParafinError({
        error_type: 'PARAFIN_CLIENT_CONFIG_ERROR',
        error_message: 'Invalid Parafin environment',
        display_message: defaultDisplayMessage,
      })
    }

    if (arguments.length > 1) {
      return new ParafinError({
        error_type: 'PARAFIN_CLIENT_CONFIG_ERROR',
        error_message: 'Too many arguments provided',
        display_message: defaultDisplayMessage,
      })
    }
  }

  async dataByBusiness(businessId: string): Promise<Ok<ParafinResponse, ParafinErrorType>> {
    return combine(
      this.config,
      { business_id: businessId },
      'partners',
      'business_cores',
      'businesses',
      'cash_advance_offer_collections',
      'cash_advances',
      'opt_ins',
    )
      .andThen(parafinResponse)
      .then(returnOrThrow)
  }

  async data(): Promise<Ok<ParafinResponse[], ParafinErrorType>> {
    const bizCores = await this.businessCores()

    const output = await Promise.all(
      bizCores.value.map(async (bizCore) => {
        const response = await this.dataByBusiness(bizCore.businessId!)
        return response.value
      }),
    )

    return ResultAsync.fromPromise(promisify(output), handleParafinError).then(returnOrThrow)
  }

  async partner(): Promise<Ok<PartnerResponse, ParafinErrorType>> {
    return get('partners', this.config).andThen(partnerResponse).then(returnOrThrow)
  }

  async businessCores(): Promise<Ok<BusinessCoreResponse[], ParafinErrorType>> {
    return get('business_cores', this.config).andThen(businessCoreResponse).then(returnOrThrow)
  }

  async businessDetails(): Promise<Ok<BusinessDetailsResponse[], ParafinErrorType>> {
    return get('businesses', this.config).andThen(businessDetailsResponse).then(returnOrThrow)
  }

  async offerCollection(): Promise<Ok<OfferCollectionResponse, ParafinErrorType>> {
    return get('cash_advance_offer_collections', this.config)
      .andThen(offerCollectionResponse)
      .then(returnOrThrow)
  }

  async cashAdvance(): Promise<Ok<CashAdvanceResponse, ParafinErrorType>> {
    return get('cash_advances', this.config).andThen(cashAdvanceResponse).then(returnOrThrow)
  }

  async cashAdvanceStates(): Promise<Ok<CashAdvanceStateResponse[], ParafinErrorType>> {
    const data = await this.data()

    const output = data.value.map((biz) => {
      return {
        businessExternalId: biz.externalId!,
        state: determineCashAdvanceState(biz)!,
      }
    })

    return ResultAsync.fromPromise(promisify(output), handleParafinError).then(returnOrThrow)
  }

  async optIn(): Promise<Ok<OptInResponse, ParafinErrorType>> {
    return get('opt_ins', this.config).andThen(optInResponse).then(returnOrThrow)
  }

  async postOptIn(data: OptInRequest): Promise<Ok<PostResponse, ParafinErrorType>> {
    return post('opt_ins', this.config, data).andThen(postResponse).then(returnOrThrow)
  }

  async postOptOut(data: OptOutRequest): Promise<Ok<PostResponse, ParafinErrorType>> {
    return post('opt_out', this.config, data).andThen(postResponse).then(returnOrThrow)
  }
}

export { Client }
