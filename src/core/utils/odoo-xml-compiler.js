// 第三版 生成自定义代码生成器

export function render(reactive, vXml = {}, ret = {}) {
  // 解析 AST 树
  for (let key in vXml) {
    const value = vXml[key]
    ret[key] = xmlObject(reactive, key, value)
  }
  // @todo 数据更新 局部重新渲染优化

  // 数据渲染
  return xmlViewCode(ret)
}

export function xmlObject(reactive, key, value) {
  // 单个节点

  const $ = value['$']
  const _ = value['_']
  let xml = { ende: `</${key}>` }

  // 属性集合
  if ($) {
    let attrs = createXmlAttrs(reactive, $)
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

function createXmlAttrs(reactive, attrs) {
  // 属性处理 (vue中这里可以进行指令、事件等处理)
  let instructs = [':', 'v-has:'] // 已有指令
  let primordial = []
  for (let attr in attrs) {
    let index = instructs.findIndex((ins) => {
      return attr.startsWith(ins)
    })
    if (index > -1) {
      let key = attr.split(instructs[index])[1]
      let val = analysisVal(reactive, attrs[attr])
      // console.log(key, val)
      switch (key) {
        case ':':
          primordial.push(`${key}='${val}'`)
          break
        case 'v-has:':
          if (val !== null || val !== undefined || val !== '') {
            primordial.push(`${key}='${val}'`)
          }
          break
        default:
          break
      }
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
  let render = compiler(content)
  let result = render(reactive)
  return result
  // 节点内容 文本内容 or 代码域 @todo 允许有多个匹配到的表达式
  // @todo 匹配{{}} 匹配不到 返回内容 匹配到进行解析 并进行数据替换
}

function compiler(template) {
  // 模版 => AST
  // AST => 优化
  // AST => Render函数
  return (options) => {
    return template.replace(/{{(.*?)}}/g, (node, key) => {
      return analysisVal(options, key)
    })
  }
}

function analysisVal(reactive, valStr) {
  // 解析字符串变量
  let data = reactive
  let keys = valStr.split('.')
  for (let itemKey of keys) {
    if (data[itemKey]) {
      data = data[itemKey]
    } else {
      data = ''
    }
  }
  return data
}

function xmlViewCode(ret) {
  for (let key in ret) {
    const { star, ende, body } = ret[key]
    if (Array.isArray(body)) {
      // 子元素
      let bodys = []
      for (let item of body) {
        let xml = xmlViewCode({ key: item })
        bodys.push(xml)
      }
      return star + bodys.join('') + ende
    } else {
      return star + body + ende
    }
  }
}
