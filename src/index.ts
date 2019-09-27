import { AxiosRequestConfig } from './types'
import xrh from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'

function axios(config: AxiosRequestConfig) {
  processConfig(config)
  xrh(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformRquestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRquestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

export default axios
