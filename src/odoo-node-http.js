// node 端获取数据
const http = require('http')
const qs = require('querystring')

const BaseUrl = '/web/'

function odoo(url, params) {
  return new Promise((resolve, rej) => {
    if (!params.params) params = { params }
    const content = qs.stringify(params)
    const options = {
      hostname: 'localhost',
      port: 8888,
      path: BaseUrl + url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    }
    const req = http.request(options, function (res) {
      console.log('STATUS: ' + res.statusCode)
      console.log('HEADERS: ' + JSON.stringify(res.headers))
      res.setEncoding('utf8')
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk)
        resolve(chunk)
      })
    })

    req.on('error', function (e) {
      console.log('problem with request: ' + e.message)
      rej(e.message)
    })

    // 将数据写入请求体
    req.write(content) //注意这个地方

    req.end()
  })
}
function searchRead(
  model,
  fields,
  offset = 0,
  limit = 8000,
  domain = [],
  sort = ''
) {
  const url = 'dataset/search_read'
  let params = {
    model, // 模型 ss.customer.analysis
    fields, // 字段 []
    offset, // 开始 0
    limit, // 结束 100
    domain, // 过滤条件 [['name', '=', 'Name']]
    sort, // 排序 'batch_no desc,sort_num asc'
  }
  return odoo(url, params)
}
function getModels(name, module = 'ss_') {
  const model = 'ir.model.data'
  const fields = [
    'id',
    'name',
    'model',
    'module',
    'complete_name',
    'display_name',
  ]
  const domain = [
    '&',
    ['model', '=', 'ir.model'],
    ['name', '=', name],
    ['module', 'like', module],
  ]
  return searchRead(model, fields, 0, 10000, domain)
}

console.log('star')
getModels('model_product_template', 'ss_sample').then((res) => {
  console.log(res)
})
console.log('ende')
