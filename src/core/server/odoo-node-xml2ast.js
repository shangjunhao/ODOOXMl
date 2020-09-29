// 读取xml文件并解析成ast
// import { render } from '../utils/odoo-xml-compiler'

const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ explicitArray: false })

// 遍历模版文件
async function getAllTempFile() {
  // let tempFileObj = {}
  const tempBasePath = __dirname + '/../temp'
  const tempDirNames = fs.readdirSync(tempBasePath)
  for (let dirName of tempDirNames) {
    // 读取模版
    const fullpath = path.join(tempBasePath, dirName, 'index.xml')
    const fullContent = fs.readFileSync(fullpath, 'utf-8')
    // 转 ast
    const fullXmlAst = await getXmlAst(fullContent)
    // 写入 json
    const filePath = path.join(tempBasePath, dirName, 'index.json')
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        key: dirName,
        ast: fullXmlAst,
        temp: fullContent,
      })
    )
  }
}

async function getXmlAst(content) {
  return new Promise((resolve, rejects) => {
    parser.parseString(content, (err, res) => {
      if (err) {
        rejects(err)
      } else {
        resolve(res)
      }
    })
  })
}

;(async () => {
  await getAllTempFile()
  console.log('模版字符串转换为AST树成功!')
})()

// export function readXmlToAst(enter, output, data = {}) {
//   const ret = fs.readFileSync(__dirname + enter + '/index.xml', 'utf-8')
//   //

//   parser.parseString(ret, (err, res) => {
//     let xml = render(data, res)
//     fs.writeFileSync(__dirname + output, xml)
//     console.log(fs, xml)
//     // '/../../dist/ss_sample/model_product_template/product_template_tree_h.xml'
//   })
// }

// http
//   .createServer((req, res) => {
//     // config
//     const pathname = url.parse(req.url).pathname

//     res.writeHead(200, { 'Content-Type': 'text/plain' })

//     if (pathname === '/getAst') {
//       let enter = '/../temp/form/index.xml'
//       const ret = fs.readFileSync(__dirname + enter, 'utf-8')
//       parser.parseString(ret, (err, ast) => {
//         res.write(JSON.stringify(ast))
//       })
//     }

//     if (pathname === '/createXml') {
//       let xml = '<odoo></odoo>'
//       let output =
//         '/../../dist/ss_sample/model_product_template/product_template_tree_h.xml'
//       fs.writeFileSync(__dirname + output, xml)
//       res.write('true')
//     }

//     res.end()
//   })
//   .listen(3001)
