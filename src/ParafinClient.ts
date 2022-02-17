import { post, get, combine } from './helpers/request'
import {
  businessCoreResponse,
  cashAdvanceResponse,
  cashAdvanceStateResponse,
  parafinResponse,
  offerCollectionResponse,
  optInResponse,
  partnerResponse,
  postResponse,
  handleParafinError,
  promisify
} from './helpers/responseManager'
import {
  BusinessCoreResponse,
  CashAdvanceResponse,
  CashAdvanceStateResponse,
  ClientConfig,
  defaultDisplayMessage,
  environment,
  OfferCollectionResponse,
  Ok,
  OptInRequest,
  OptInResponse,
  OptOutRequest,
  ParafinError,
  ParafinResponse,
  PartnerResponse,
  PostResponse,
  ResultAsync,
  returnOrThrow
} from './types'

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
        display_message: defaultDisplayMessage
      })
    }

    if (
      this.config.environment !== environment.development ||
      this.config.environment !== environment.production
    ) {
      return new ParafinError({
        error_type: 'PARAFIN_CLIENT_CONFIG_ERROR',
        error_message: 'Invalid Parafin environment',
        display_message: defaultDisplayMessage
      })
    }

    if (arguments.length > 1) {
      return new ParafinError({
        error_type: 'PARAFIN_CLIENT_CONFIG_ERROR',
        error_message: 'Too many arguments provided',
        display_message: defaultDisplayMessage
      })
    }
  }

  async data(businessId: string): Promise<Ok<ParafinResponse, ParafinError>> {
    return combine(
      this.config,
      { business_id: businessId },
      'cash_advance_offer_collections',
      'cash_advances',
      'opt_ins'
    )
      .andThen(parafinResponse)
      .then(returnOrThrow)
  }

  async dataMultiBiz(): Promise<Ok<ParafinResponse[], ParafinError>> {
    const partner = await this.partner()
    const bizCores = await this.businessCore()
    const output: ParafinResponse[] = []

    if (bizCores.isOk() && partner.isOk()) {
      bizCores.value.map(async (bizCore) => {
        const combinedRequest = await this.data(bizCore.businessId!)
        if (combinedRequest.isOk()) {
          output.push({
            ...combinedRequest.value,
            businessId: bizCore.businessId,
            externalId: bizCore.externalId,
            partnerId: partner.value.partnerId,
            partnerName: partner.value.partnerName,
            partnerSlug: partner.value.partnerSlug
          })
        }
      })
    }
    return ResultAsync.fromPromise(promisify(output), handleParafinError).then(returnOrThrow)
  }

  async partner(): Promise<Ok<PartnerResponse, ParafinError>> {
    return get('partners', this.config)
      .andThen(partnerResponse)
      .then(returnOrThrow)
  }

  async businessCore(): Promise<Ok<BusinessCoreResponse[], ParafinError>> {
    return get('businesses/core', this.config)
      .andThen(businessCoreResponse)
      .then(returnOrThrow)
  }

  async offerCollection(): Promise<Ok<OfferCollectionResponse, ParafinError>> {
    return get('cash_advance_offer_collections', this.config)
      .andThen(offerCollectionResponse)
      .then(returnOrThrow)
  }

  async cashAdvance(): Promise<Ok<CashAdvanceResponse, ParafinError>> {
    return get('cash_advances', this.config)
      .andThen(cashAdvanceResponse)
      .then(returnOrThrow)
  }

  async cashAdvanceState(): Promise<Ok<CashAdvanceStateResponse, ParafinError>> {
    const mergedPromises = Promise.all([this.offerCollection(), this.cashAdvance()])

    return mergedPromises
      .then(cashAdvanceStateResponse)
      .then(returnOrThrow)
  }

  async optIn(): Promise<Ok<OptInResponse, ParafinError>> {
    return get('opt_ins', this.config)
      .andThen(optInResponse)
      .then(returnOrThrow)
  }

  async postOptIn(data: OptInRequest): Promise<Ok<PostResponse, ParafinError>> {
    return post('opt_ins', this.config, data)
      .andThen(postResponse)
      .then(returnOrThrow)
  }

  async postOptOut(
    data: OptOutRequest
  ): Promise<Ok<PostResponse, ParafinError>> {
    return post('opt_out', this.config, data)
      .andThen(postResponse)
      .then(returnOrThrow)
  }
}

export { Client }
