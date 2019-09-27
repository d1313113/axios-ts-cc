import { AxiosRequestConfig } from './types'
import xrh from './xhr'

function axios(config: AxiosRequestConfig) {
  xrh(config)
}

export default axios
