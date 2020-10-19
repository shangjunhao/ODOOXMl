const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ explicitArray: false })

function readXmlTemp(path) {
  // 将 xml 转化为 json
}

function exportXmlJson(path) {
  // 导出转化后的 json
}

function createXmlView(obj) {
  // 根据数据模型生成xml字符串
  var builder = new xml2js.Builder()
  var xml = builder.buildObject(obj)
  return xml
}

function exportXmlFiel(path, name, context) {
  // 根据 context 生成 xml 文件
  let dir = './src/dist/' + path + '/'
  if (!fs.existsSync('./src/dist/')) {
    fs.mkdirSync('./src/dist/') // , 0744
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFile(dir + name + '.xml', context, (err) => {
    if (err) throw err
    console.log('文件已保存')
  })
}

// @todo 虚拟xml(替换后的对象) => xml字符串 => xml文件

http
  .createServer((req, res) => {
    //获取get请求中的参数
    const requset_url = req.url
    //将字符串格式参数转化为对象使用
    const strurl = url.parse(requset_url, true).query

    console.log('服务器开启', requset_url, strurl, req)

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write('hellow')
    // config
    // const pathname = url.parse(req.url).pathname

    // res.writeHead(200, { 'Content-Type': 'text/plain' })

    // if (pathname === '/getAst') {
    //   let enter = '/../temp/form/index.xml'
    //   const ret = fs.readFileSync(__dirname + enter, 'utf-8')
    //   parser.parseString(ret, (err, ast) => {
    //     res.write(JSON.stringify(ast))
    //   })
    // }

    // if (pathname === '/createXml') {
    //   let xml = '<odoo></odoo>'
    //   let output =
    //     '/../../dist/ss_sample/model_product_template/product_template_tree_h.xml'
    //   fs.writeFileSync(__dirname + output, xml)
    //   res.write('true')
    // }

    res.end()
  })
  .listen(3001)
