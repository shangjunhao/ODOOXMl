const { analysisVal } = require('./text')
const { analysisContent } = require('./content')
const { analysisAstAttrs, instructsRegionState } = require('./instructs')
// 第四版 直接修改ast树 对ast树进行修改和渲染

function compile(template) {
  // 正常情况下在这里对模板进行解析 解析成 AST 对象 这里直接传入的就是AST对象
  const ast = template
  // 解析 AST 树
  // 解析优化
  // 返回渲染函数
  return function render(reactive) {
    let renderAst = {}
    for (let target in ast) {
      analysisAstExample(reactive, ast, target, ast[target], {}, renderAst)
    }
    return renderAst
  }
}

function analysisAstExample(
  reactive,
  ast,
  target,
  astItem,
  parentCtx,
  renderAst
) {
  // ast: { odoo: { _: '', $: {}, data: {} } }
  // target: odoo
  // astItem: { _: '', $: {}, data: {} }
  // 父元素 属性、文本、子节点处理
  // 这里的返回可能是对象 也可能是数组 也可能是 false
  let item = false
  let $ = astItem['$']
  let _ = astItem['_']
  let region = instructsRegionState($, reactive)
  if (region && region.if && !region.val) {
    // v-if
    // return false
  } else if (region && region.key) {
    // v-for
    let astList = []
    const { key, val } = region
    for (const item of val) {
      parentCtx[key] = item
      let astNodeItem = analysisAstItem(astItem, $, _, reactive, parentCtx)
      astList.push(astNodeItem)
    }
    item = astList
  } else {
    let astNodeItem = analysisAstItem(astItem, $, _, reactive, parentCtx)
    item = astNodeItem
  }

  // 处理结果
  // if (region && region.if && !region.val) {
  //   console.log('region', target, renderAst, item)
  // }
  if (Array.isArray(renderAst)) {
    if (Array.isArray(item)) {
      renderAst.push(...item)
    } else if (typeof item === 'object') {
      renderAst.push(item)
    } else {
      // item 为空
    }
  } else if (typeof renderAst === 'object') {
    if (item) {
      renderAst[target] = item
    } else {
      delete renderAst[target]
    }
  }
}

function analysisAstItem(ast, $, _, reactive, ctx) {
  // 重组为新的ast
  let astNodeAttrs = analysisAstAttrs($, reactive, ctx)
  let astNodeContent = analysisContent(_, reactive, ctx)
  let astNodeChildren = analysisNodeExample(ast, reactive, ctx)
  let hasAstNodeAttrs = Object.keys(astNodeAttrs).length > 0
  if (hasAstNodeAttrs) {
    astNodeChildren['$'] = astNodeAttrs
  }
  if (astNodeContent) {
    astNodeChildren['_'] = astNodeContent
  }
  return astNodeChildren
}

function analysisNodeExample(ast, reactive, ctx) {
  // 循环遍历子元素节点 子组件
  let newAst = {}
  for (let target in ast) {
    if (target.startsWith('v-')) {
      // 组件节点
    } else if (target !== '$' && target !== '_') {
      // 子标签 [] {} ''
      let node = ast[target]
      if (Array.isArray(node)) {
        // 子节点列表
        let newAstChildren = []
        for (let childItem of node) {
          if (typeof childItem === 'object') {
            // let astChild =
            analysisAstExample(
              reactive,
              node,
              target,
              childItem,
              ctx,
              newAstChildren
            )
          } else {
            // @todo 这里 item 可能不是对象 不是对象不处理
          }
        }
        newAst[target] = newAstChildren
      } else {
        // 单个子节点
        analysisAstExample(reactive, ast, target, node, ctx, newAst)
      }
    }
  }
  return newAst
}

module.exports = {
  compile,
}
