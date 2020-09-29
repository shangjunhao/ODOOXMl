// import { xmlObject } from './compiler' // 第五版
// import { xmlObject } from './odoo-xml-compiler' // 第三版

export function render(reactive, vXml = {}, ret = {}) {
  // 解析 AST 树
  for (let key in vXml) {
    const value = vXml[key]
    const $ = value['$']
    const _ = value['_']

    // 属性处理
    $ && createXmlAttrs(reactive, $)
  }
  // @todo 数据更新 局部重新渲染优化

  // 数据渲染
  return xmlViewCode(ret)
}

export function xmlObject(reactive, key, value) {
  //
  const $ = value['$']
  const _ = value['_']

  // 属性处理
  $ && createXmlAttrs(reactive, $)
}
