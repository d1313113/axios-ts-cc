import axios from '../src/index'
import merge from '../src/core/merge'

describe('mergeConfig', () => {
  const defaults = axios.defaults
  test('should accept undefined for second argument', () => {
    expect(merge(defaults, undefined)).toEqual(defaults)
  })

  test('should accept an object for second argument', () => {
    expect(merge(defaults, {})).toEqual(defaults)
  })

  test('should not leave references', () => {
    const merged = merge(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('should allow setting request options', () => {
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = merge(defaults, config)
    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })

  test('should not inherit request options', () => {
    const localDefaults = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = merge(localDefaults, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  test('should return default headers if pass config2 with undefined', () => {
    expect(
      merge(
        {
          headers: 'x-mock-header'
        },
        undefined
      )
    ).toEqual({
      headers: 'x-mock-header'
    })
  })

  test('should merge auth, headers with defaults', () => {
    expect(
      merge(
        {
          auth: undefined
        },
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'foo',
        password: 'test'
      }
    })

    expect(
      merge(
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        },
        {
          auth: {
            username: 'baz',
            password: 'foobar'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'baz',
        password: 'foobar'
      }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    expect(
      merge(
        {
          headers: {
            common: {
              Accept: 'application/json, text/plain, */*'
            }
          }
        },
        {
          headers: null
        }
      )
    ).toEqual({
      headers: null
    })
  })

  test('should allow setting other options', () => {
    const merged = merge(defaults, {
      timeout: 123
    })

    expect(merged.timeout).toBe(123)
  })
})