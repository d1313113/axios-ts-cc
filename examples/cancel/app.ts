import axios from '../../src/axios'
import { Canceler } from '../../src/types'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request Cancel', error.message)
  }
})

setTimeout(() => {
  source.cancel('用户取消请求')

  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token
  }).catch(error => {
    if (axios.isCancel(error)) {
      console.log(error.message)
    }
  })
}, 100)

let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => {
    cancel = c
  })
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('请求取消')
  }
})

setTimeout(() => {
  cancel()
}, 200)
