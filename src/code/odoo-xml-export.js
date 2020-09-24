import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'

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

export function exportXmlFiel(path, name, context) {
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

const field = {
  field: {
    $: {
      name: 'name',
      require: '0',
      readonly: '0',
      invisible: '0',
      widget: '',
    },
  },
}
const xml = createXmlView(field)
exportXmlFiel('ss_sample', 'product_template_view', xml)
