import { any, equals, is, values } from 'ramda'

import { ParafinEnvironments } from './ParafinEnvironments'
import { parafinRequest } from './parafinRequest'
import { ClientConfig } from './ClientConfig'

class Client {
  config: ClientConfig

  constructor(config: ClientConfig) {
    this.config = config
  }

  validateInput() {
    if (!is(Object, this.config)) {
      throw new Error(
        'Unexpected parameter type. ' +
          'Refer to github.com/buildparafin/parafin-node ' +
          'for how to create a Parafin client.',
      )
    }
  
    if (!any(equals(this.config.environment), values(ParafinEnvironments))) {
      throw new Error('Invalid Parafin environment')
    }
  
    if (arguments.length > 1) {
      throw new Error('Too many arguments to constructor')
    }
  }

  partners() {
    return parafinRequest('partners', this.config)
  }
}

export { Client }
