import axios from 'axios'

const baseURL = 'web/'
const timeout = 30000
const Http = axios.create({
  baseURL: baseURL, // 设置请求地址
  timeout: timeout, //设置超时
  withCredentials: false, // 是否允许带cookie这些
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})
const responseSuccess = (res, resolve) => {
  // 响应成功 请求失败 错误码解析
  if (res.result) {
    // 请求成功
    res = typeof res.result === 'string' ? JSON.parse(res.result) : res.result
    if (!res.status && res['error_code']) {
      console.error(
        `错误代码：${res['error_code']},错误信息： ${res['failure_msg']}`
      )
    } else if (res.status) {
      res && resolve(res.data)
    } else {
      res && resolve(res)
    }
  } else if (res.error) {
    // ODOO 报错
    res = res.error
    console.log(
      `错误代码：${res.code}错误信息：${res.message}错误提示：${res.data.message}`
    )
  } else {
    //
  }
}

function odoo(url, params = {}) {
  if (!params.params) params = { params }
  return new Promise((resolve, reject) => {
    Http.post(url, JSON.stringify(params))
      .then((res) => {
        res = res['data']
        responseSuccess(res, resolve)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  odoo,
}
