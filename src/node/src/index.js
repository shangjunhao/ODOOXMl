const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')
const { writeManifest } = require('./other/manifest')

const viewsPath =
  '/Users/shangjunhao/WorkProject/ERP_odoo/odooDev/oscg/ss_web_page/views'

// ast => render
const { compile } = require('./compiler/compiler')

async function getXmlCode(xmlAst) {
  // ast => xml promise
  const builder = new xml2js.Builder({
    includeWhiteChars: true,
  })
  const xmlCode = builder.buildObject(xmlAst)
  return xmlCode
}

async function getXmlFile(xmlCode, name) {
  // xml => file
  let filePath = path.join(viewsPath, `/base_${name}.xml`)
  fs.writeFileSync(filePath, xmlCode)
  console.log('loader-xml-file: xml文件生成成功!', name)
}

async function updateViewCodeHttp(temp, data, callback) {
  // ast
  const name = data.model._model
  const parser = new xml2js.Parser({ explicitArray: false })
  parser.parseString(temp, (err, ast) => {
    if (!err) {
      // 渲染函数
      const render = compile(ast)
      // 获取新的ast
      const xmlAst = render(data)
      // 获取新的xml
      getXmlCode(xmlAst)
        .then((xmlCode) => {
          // 生成对应的文件
          getXmlFile(xmlCode, name)
          // 重写配置文件
          writeManifest()
          callback({
            ast,
            name,
            xmlAst,
            xmlCode,
          })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      console.log('err', err)
      callback(false, err)
    }
  })
}

module.exports = updateViewCodeHttp
