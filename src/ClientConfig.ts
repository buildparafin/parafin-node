type ClientConfig = {
  clientId: string
  secret: number
  environment: string
  options: ConfigOptions | null
}

type ConfigOptions = {
  version?: string
}

export { ClientConfig }
