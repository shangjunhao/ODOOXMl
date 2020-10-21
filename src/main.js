import axios from 'axios'
import { getModels, getFields } from './web/http/odoo-http'

import temp from './web/temp'
import getData from './web/computed'
// import config from './web/view/delivery_order_line_tree'
// import config from './web/view/delivery_proforma_invoice'
import config from './web/view/delivery_proforma_invoice_line'

async function createFile(params) {
  const Http = axios.create({
    baseURL: 'node/', // 设置请求地址
    timeout: 3000, //设置超时
    withCredentials: false, // 是否允许带cookie这些
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
  return Http.post('/node/a', JSON.stringify(params))
}

console.log(config)
;(async () => {
  const { key, module } = config
  const key2 = key.replace('model_', '').replace(/\_/g, '.')
  Promise.all([getModels(key, module), getFields(key2)]).then(
    ([model, fields]) => {
      // console.log(model, fields, temp)
      // 校验
      if (model.length > 0 && fields.length > 0) {
        // 获取填充数据
        const pageData = getData(config, model.records[0], fields.records)
        // 调用生成接口
        // console.log(pageData)
        const parmas = {
          temp,
          data: pageData,
        }
        createFile(parmas).then((res) => {
          // console.log(res.data)
          // console.log(JSON.stringify(res.data.xmlAst))
        })
      }
    }
  )
})()
