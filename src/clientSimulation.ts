import * as parafin from './parafin'

const token = 'abc'

const parafinClient = new parafin.Client({
  token: token,
  environment: parafin.ParafinEnvironments.production,
})

parafinClient.partners().then((data: any) => console.log(data))
