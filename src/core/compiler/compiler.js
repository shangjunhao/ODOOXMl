import { analysisVal } from './text'
import { analysisContent } from './content'
import { analysisAstAttrs, instructsRegionState } from './instructs'
// 第四版 直接修改ast树 对ast树进行修改和渲染

export default function compile(template, option) {
  // 正常情况下在这里对模板进行解析 解析成 AST 对象 这里直接传入的就是AST对象
  const ast = template
  // 解析 AST 树
  // 解析优化
  // 返回渲染函数
  return function render(reactive) {
    let renderAst = {}
    for (let target in ast) {
      let item = analysisAstExample(reactive, ast, target, ast[target])
      if (item) {
        renderAst[target] = item
      }
    }
    return renderAst
  }
}

function analysisAstExample(reactive, ast, target, astItem) {
  // ast: { odoo: { _: '', $: {}, data: {} } }
  // target: odoo
  // astItem: { _: '', $: {}, data: {} }
  // 父元素 属性、文本、子节点处理
  let $ = astItem['$']
  let _ = astItem['_']
  let region = instructsRegionState($, reactive)
  if (region) {
    // v-for
    let astList = []
    const { key, val } = region
    for (const item of val) {
      let astNodeItem = analysisAstItem(astItem, $, _, reactive, key, item)
      astList.push(astNodeItem)
    }
    return astList
  } else {
    let astNodeItem = analysisAstItem(astItem, $, _, reactive, null, null)
    return astNodeItem
  }
}

function analysisAstItem(ast, $, _, reactive, key, item) {
  // 重组为新的ast
  let astNodeAttrs = analysisAstAttrs($, reactive, key, item)
  let astNodeContent = analysisContent(_, reactive, key, item)
  let astNodeChildren = analysisNodeExample(ast, reactive, key, item)
  let hasAstNodeAttrs = Object.keys(astNodeAttrs).length > 0
  if (hasAstNodeAttrs) {
    astNodeChildren['$'] = astNodeAttrs
  }
  if (astNodeContent) {
    astNodeChildren['_'] = astNodeContent
  }
  return astNodeChildren
}

function analysisNodeExample(ast, reactive, key, item) {
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
            let astChild = analysisAstExample(reactive, node, target, childItem)
            newAstChildren.push(astChild)
          } else {
            // @todo 这里 item 可能不是对象 不是对象不处理
          }
        }
      } else {
        // 单个子节点
        let astChild = analysisAstExample(reactive, ast, target, node)
        astChild && (newAst[target] = astChild)
      }
    }
  }
  return newAst
}
