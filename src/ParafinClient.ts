import { request, requestCombine } from './request';
import { cashAdvanceResponse, offerCollectionResponse, partnerResponse } from './responseManager';
import { ClientConfig, ParafinEnvironments } from './types';

class Client {
  config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = config;
  }

  validateInput() {
    if (typeof this.config !== 'object' || this.config === null) {
      throw new Error(
        'Unexpected parameter type. ' +
          'Refer to github.com/buildparafin/parafin-node ' +
          'for how to create a Parafin client.',
      );
    }

    if (
      this.config.environment !== ParafinEnvironments.development ||
      this.config.environment !== ParafinEnvironments.production
    ) {
      throw new Error('Invalid Parafin environment');
    }

    if (arguments.length > 1) {
      throw new Error('Too many arguments to constructor');
    }
  }

  async data() {
    const data = await requestCombine(this.config, 'partners', 'cash_advance_offer_collections_v2', 'cash_advances');
    return data;
  }

  async partners() {
    const partner = partnerResponse(await request('partners', this.config));
    return partner;
  }

  async offerCollection() {
    const offerCollection = offerCollectionResponse(await request('cash_advance_offer_collections_v2', this.config));
    return offerCollection;
  }

  async cashAdvance() {
    const cashAdvance = cashAdvanceResponse(await request('cash_advances', this.config));
    return cashAdvance;
  }
}

export { Client };
