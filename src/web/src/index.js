import axios from 'axios'
import { getModels, getFields, createFile } from './http/odoo-http'

import temp from './view/assembly'
import getData from './utils/computed'
import getPages from './view/config.export.js'

console.log(getPages)

function generate(config) {
  const { key, module } = config

  // model_product_template
  // const key1 = key
  // const key2 = key.replace('model_', '').replace(/\_/g, '.')

  // product.template
  const key1 = 'model_' + key.replace(/\./g, '_')
  const key2 = key

  Promise.all([getModels(key1, module), getFields(key2)]).then(
    ([model, fields]) => {
      // 校验
      if (model.length > 0 && fields.length > 0) {
        // 获取填充数据
        const pageData = getData(config, model.records[0], fields.records)
        // 调用生成接口
        const parmas = {
          temp,
          data: pageData,
        }
        createFile(parmas).then((res) => {
          console.log('xml文件已生成: ', res.data.name)
          // console.log(JSON.stringify(res.data.xmlAst))
        })
      }
    }
  )
}

export function ergodicAllPage() {
  getPages.pages.forEach((element) => {
    generate(element)
  })
}
