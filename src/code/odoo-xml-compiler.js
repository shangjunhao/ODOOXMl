import Utils from './odoo-utils'
const { convertAttrs } = Utils

function normalizeOpt(options) {
  // 数据统一处理函数
  return options
}

export function compiler(template) {
  // 模版 => AST
  // AST => 优化
  // AST => Render函数
  return (options) => {
    let normalizeData = normalizeOpt(options)
    return template.replace(/{{(.*?)}}/g, (node, key) => {
      return options[key]
    })
  }
}

/** 第三版 **/
const xml = {
  star: '<data id="" name="">',
  ende: '</data>',
  body: '{{content}}',
}
const ret = {
  record: {
    star: '<record id="" name="">',
    ende: '</record>',
    body: [
      { field: xml },
      { field: xml },
      {
        field: {
          star: '<field id="" name="">',
          ende: '</field>',
          body: [
            {
              search: {
                star: '<search id="" name="">',
                ende: '</search>',
                body: [{ field: xml }, { field: xml }],
              },
            },
          ],
        },
      },
    ],
  },
}

// 第三版 生成自定义代码生成器

const xmlJson = {}
export function render(reactive, vXml = xmlJson, ret = {}) {
  // debugger
  // 解析 AST 树
  for (let key in vXml) {
    const value = vXml[key]
    ret[key] = xmlObject(reactive, key, value)
  }
  // @todo 数据更新 局部重新渲染优化

  // 数据渲染
  return ret
}

function xmlObject(reactive, key, value) {
  // 单个节点

  const $ = value['$']
  const _ = value['_']
  let xml = { ende: `</${key}>` }

  // 属性集合
  if ($) {
    let attrs = createXmlAttrs($)
    xml.star = `<${key} ${attrs}>`
  } else {
    xml.star = `<${key}>`
  }

  // 内容
  if (_) {
    // dom文本内容 (与子节点内容相斥)
    xml.body = xmlContent(reactive, _)
  } else {
    // 子节点列表
    xml.body = []
    for (let attr in value) {
      if (attr !== '$' && attr !== '_') {
        // 子标签
        const node = value[attr]
        if (Array.isArray(node)) {
          // 子节点列表
          for (let item of node) {
            if (typeof item === 'object') {
              xml.body.push(xmlObject(reactive, attr, item))
              // xml.body.push(render(reactive, { [key]: item }, {}))
            } else {
              // @todo 这里 item 可能不是对象 不是对象不处理
              // xml.body = ''
            }
          }
        } else {
          // 单个节点元素
          xml.body.push(xmlObject(reactive, attr, node))
          // ret[key] = xmlObject(reactive, key, value)
        }
      }
    }
  }

  return xml
}

function createXmlAttrs(attrs) {
  // 属性处理 (vue中这里可以进行指令、事件等处理)
  let instructs = []
  let primordial = []
  for (let attr in attrs) {
    if (instructs.includes(attr)) {
      // 指令解析 @todo
    } else {
      // 原生属性
      primordial.push(`${attr}='${attrs[attr]}'`)
    }
  }
  return primordial.join(' ')
  // convertAttrs(val[attr])
}

function xmlContent(reactive, content) {
  return content
  // 节点内容 文本内容 or 代码域 @todo 允许有多个匹配到的表达式
  // @todo 匹配{{}} 匹配不到 返回内容 匹配到进行解析 并进行数据替换
}

function xmlViewCode(xml) {}
