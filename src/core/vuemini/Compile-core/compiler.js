import compileContent from './content'
import analysisAstAttrs from './instructs'
// 第四版 直接修改ast树 对ast树进行修改和渲染

export default function compile(template) {
  // 正常情况下在这里对模板进行解析 解析成 AST 对象 这里直接传入的就是AST对象
  const ast = template
  // 解析 AST 树

  // 解析优化

  // 返回渲染函数
  return function render(reactive) {
    let newAst = {}
    for (let key in ast) {
      const value = ast[key]
      const vnode = xmlObject(key, value, reactive)

      // vnode 返回 false 代表此元素不渲染
      if (vnode) {
        newAst[key] = vnode
      }
    }
    // newAst 发起请求 生成文件
    // var xml2js = require('xml2js')
    // let builder = new xml2js.Builder()
    // let xml = builder.buildObject(ast)
    // console.log(xml, xml2js)
    // return xml
    return newAst
  }
  return function render(reactive) {
    let newAst = xmlObject(ast, reactive)
  }
  return function xmlObject(ast, reactive) {
    let newAst = {}

    const $ = ast['$']
    const _ = ast['_']

    // 属性
    if ($) {
      // 属性解析
      newAst['$'] = analysisAstAttrs($, reactive)
      // _isNotExhibition 不渲染
      if (newAst['$']['_isNotExhibition']) {
        // 不渲染
        // return false
      }
    }

    // 内容
    if (_) {
      // 内容解析
      newAst['_'] = compileContent(_, reactive)
    }

    for (let tager in ast) {
      if (tager !== '$' && tager !== '_') {
        // 子标签 [] {} contetn
        let node = ast[tager]
        if (Array.isArray(node)) {
          // 子节点列表
          let newAstVals = []
          for (let nodeItem of node) {
            if (typeof nodeItem === 'object') {
              const newVal = xmlObject(nodeItem, reactive)
              newAstVals.push(newVal)
            } else {
              // @todo 这里 item 可能不是对象 不是对象不处理
            }
          }
          newAst[tager] = newAstVals
        } else {
          // 单个子节点
          newAst[tager] = xmlObject(node, reactive)
        }
      }
    }
    return newAst
  }
}

function xmlObject(key, value, reactive) {
  const $ = value['$']
  const _ = value['_']

  // 属性
  if ($) {
    // 属性解析
    value['$'] = analysisAstAttrs($, reactive)
    // _isNotExhibition 不渲染
    if (value['$']['_isNotExhibition']) {
      // 不渲染
      return false
    }
  }

  // 内容
  if (_) {
    // 内容解析
    value['_'] = compileContent(_, reactive)
  }

  for (let tager in value) {
    if (tager !== '$' && tager !== '_') {
      // 子标签 [] {} contetn
      let node = value[tager]
      if (Array.isArray(node)) {
        // 子节点列表
        let newAstVals = []
        for (let nodeItem of node) {
          if (typeof nodeItem === 'object') {
            const newVal = xmlObject(tager, nodeItem, reactive)
            newAstVals.push(newVal)
          } else {
            // @todo 这里 item 可能不是对象 不是对象不处理
          }
        }
        value[tager] = newAstVals
      } else {
        // 单个子节点
        value[tager] = xmlObject(tager, node, reactive)
      }
    }
  }
  return value
}
