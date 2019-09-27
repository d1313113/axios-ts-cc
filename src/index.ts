import { AxiosRequestConfig } from './types'
import xrh from './xhr'
import { buildURL } from './helpers/url'

function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xrh(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

export default axios
