import { post, get, getCombine } from './request'
import {
  businessResponse,
  cashAdvanceResponse,
  offerCollectionResponse,
  optInResponse,
  partnerResponse,
  postResponse
} from './responseManager'
import { ClientConfig, environment, OptInRequest } from './types'

class Client {
  config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  validateInput() {
    if (typeof this.config !== 'object' || this.config === null) {
      throw new Error(
        'Unexpected parameter type. ' +
          'Refer to github.com/buildparafin/parafin-node ' +
          'for how to create a Parafin client.'
      )
    }

    if (
      this.config.environment !== environment.development ||
      this.config.environment !== environment.production
    ) {
      throw new Error('Invalid Parafin environment')
    }

    if (arguments.length > 1) {
      throw new Error('Too many arguments to constructor')
    }
  }

  async data() {
    const data = await getCombine(
      this.config,
      'partners',
      'businesses',
      'cash_advance_offer_collections_v2',
      'cash_advances',
      'opt_ins'
    )
    return data
  }

  async partners() {
    const partner = partnerResponse(await get('partners', this.config))
    return partner
  }

  async businesses() {
    const businesses = businessResponse(await get('businesses', this.config))
    return businesses
  }

  async offerCollection() {
    const offerCollection = offerCollectionResponse(
      await get('cash_advance_offer_collections_v2', this.config)
    )
    return offerCollection
  }

  async cashAdvance() {
    const cashAdvance = cashAdvanceResponse(
      await get('cash_advances', this.config)
    )
    return cashAdvance
  }

  async optIn() {
    const optIn = optInResponse(await get('opt_ins', this.config))
    return optIn
  }

  async postOptIn(data: OptInRequest) {
    const optIn = postResponse(await post('opt_ins', this.config, data))
    return optIn
  }
}

export { Client }
