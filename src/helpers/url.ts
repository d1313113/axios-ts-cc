import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

/**
 * 对url参数进行编码,针对部分特殊字符进行还原
 * @param {string} val
 * @return {string} encodeRes
 */
function encode(val: string): string {
  return (
    encodeURIComponent(val)
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2c/gi, ',')
      // 处理空格为+
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

/**
 * 根据参数构造url
 * @param {string} url
 * @param {*} params
 * @return {string} url
 */
export function buildURL(url: string, params?: any): string {
  // 没有请求参数的话直接返回url
  if (!params) {
    return url
  }

  // 定义参数key=val键值对数组
  const parts: string[] = []

  // 遍历参数
  Object.keys(params).forEach(key => {
    const value = params[key]
    // 对于null及undefined的val直接忽略
    if (value === null || typeof value === 'undefined') {
      return
    }
    let values = []
    // 数组形式的,拼接成k[]=v&k[]=v
    if (Array.isArray(value)) {
      values = value
      key += '[]'
    } else {
      values = [value]
    }
    values.forEach(val => {
      // 处理Date类型
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        // 处理对象
        val = JSON.stringify(val)
      }
      // 将key与valencode
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 序列化参数
  let serializedParams = parts.join('&')

  if (serializedParams) {
    // 处理hash
    const markIndex = url.indexOf('#')
    if (markIndex > -1) {
      url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)

  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
