import { request } from './request'
import { ClientConfig, ParafinEnvironments } from './types'

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
          'for how to create a Parafin client.',
      )
    }
  
    if (this.config.environment !== ParafinEnvironments.development 
      || this.config.environment !== ParafinEnvironments.production) {
      throw new Error('Invalid Parafin environment')
    }
  
    if (arguments.length > 1) {
      throw new Error('Too many arguments to constructor')
    }
  }

  partners() {
    return request('partners', this.config)
  }
}

export { Client }
