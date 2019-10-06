import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 === 'undefined' ? val1 : val2
}

function fromVal2strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
}

const stratKeysFromVal2 = ['data', 'params', 'url']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2strat
})

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig(
  defaultConfig: AxiosRequestConfig,
  userConfig?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!userConfig) {
    userConfig = {}
  }

  const config = Object.create(null)

  for (let key in userConfig) {
    mergeField(key)
  }

  for (let key in defaultConfig) {
    if (!userConfig[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat

    config[key] = strat(defaultConfig[key], userConfig![key])
  }

  return config
}
