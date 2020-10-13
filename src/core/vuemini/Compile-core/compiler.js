import { analysisVal } from './text'
// import { analysisNode } from './astnode'
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
  // console.log('ast', ast, target, astItem, region)
  if (region) {
    // delete ast['$']['v-for']
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
  // console.log('重组为新的ast', key, _, $, item, '\t\t\t\t\r\r\r\r\n\r')
  let astNodeAttrs = analysisAstAttrs($, reactive, key, item)
  let astNodeContent = analysisContent(_, reactive, key, item)
  let astNodeChildren = analysisNodeExample(ast, reactive, key, item)
  let astNodeItem = {
    $: astNodeAttrs,
    _: astNodeContent,
    ...astNodeChildren,
  }
  return astNodeItem
}

function analysisNodeExample(ast, reactive, key, item) {
  // 循环遍历子元素节点 子组件
  let newAst = {}
  for (let target in ast) {
    if (target.startsWith('v-')) {
      // 组件节点
      // console.log(tager, ast[tager])
    } else if (target !== '$' && target !== '_') {
      // 子标签 [] {} ''
      let node = ast[target]
      if (Array.isArray(node)) {
        // 子节点列表
        let newAstChildren = []
        for (let childItem of node) {
          if (typeof childItem === 'object') {
            // for(let childTarget in childItem) {
            // }
            let astChild = analysisAstExample(reactive, node, target, childItem)
            newAstChildren.push(astChild)
          } else {
            // @todo 这里 item 可能不是对象 不是对象不处理
          }
        }
        // newAst[target] = newAstChildren
      } else {
        // 单个子节点
        let astChild = analysisAstExample(reactive, ast, target, node)
        astChild && (newAst[target] = astChild)
      }
    }
  }
  return newAst
}

/// 废弃
///
///
///
///

// function xmlObject(ast, reactive) {
//   let newAst = {}

//   for (let tager in ast) {
//     let region = null
//     if (tager.startsWith('v-')) {
//       // 组件节点
//       // console.log(tager, ast[tager])
//       analysisAssembly(tager, ast[tager])
//     } else if (tager === '$') {
//       // 属性解析 @todo 指令解析、数据传递props、v-if、v-for等需要额外处理
//       const $ = ast['$']

//       newAst['$'] = analysisAstAttrs($, reactive)
//     } else if (tager === '_') {
//       // 内容解析 @todo 文本解析、注释解析
//       const _ = ast['_']
//       newAst['_'] = compileContent(_, reactive)
//     } else if (tager !== '$' && tager !== '_') {
//       // 子标签 [] {} contetn
//       let node = ast[tager]
//       if (Array.isArray(node)) {
//         // 子节点列表
//         let newAstVals = []
//         // console.log('node', node)
//         for (let nodeItem of node) {
//           if (typeof nodeItem === 'object') {
//             const newVal = xmlObject(nodeItem, reactive)
//             // 在这里进行额外的处理 v-for v-if
//             const astVal = childrenNodeInsCheck(
//               ast,
//               tager,
//               newVal,
//               newAst,
//               reactive
//             )
//             if (Array.isArray(astVal)) {
//               newAstVals = [...newAstVals, ...astVal]
//             } else {
//               astVal && newAstVals.push(astVal)
//             }
//           } else {
//             // @todo 这里 item 可能不是对象 不是对象不处理
//           }
//         }
//         newAst[tager] = newAstVals
//       } else {
//         // 单个子节点
//         const newVal = xmlObject(node, reactive)
//         const astVal = childrenNodeInsCheck(
//           ast,
//           tager,
//           newVal,
//           newAst,
//           reactive
//         )
//         console.log(tager, newVal, astVal)
//         astVal && (newAst[tager] = astVal)
//       }
//     }
//   }
//   return newAst
// }

// function childrenNodeInsCheck(ast, tager, newVal, newAst, reactive) {
//   // 子元素节点指令数据处理
//   let _ = ast['_'] || ''
//   let primordial =
//     newVal['$'] && newVal['$']['primordial'] ? newVal['$']['primordial'] : {}
//   let process =
//     newVal['$'] && newVal['$']['process'] ? newVal['$']['process'] : {}

//   if (!isNotExhibition(newVal)) {
//     // console.log('不渲染', newVal)
//     return false
//   }
//   if (primordial && primordial.fors) {
//     const fors = primordial.fors
//     delete primordial.fors
//     const items = analysisVal(reactive, fors.val, null, null)
//     // console.log(fors)
//     // 1、该元素重复n次
//     // 2、该元素中使用到的数据包含循环体数据

//     let valItems = []
//     // console.log(items, reactive, fors.val)
//     for (let item of items) {
//       let valItem = JSON.parse(JSON.stringify(newVal))
//       newAst['$'] = getPrimordialAttrs(
//         primordial,
//         process,
//         reactive,
//         item,
//         fors.alias
//       )
//       if (_) {
//         valItem['_'] = analysisVal(reactive, _, item, fors.alias)
//       }
//       valItems.push(valItem)
//     }
//     // console.log(newVal)
//     return valItems
//   }
//   if (_) {
//     newVal['_'] = analysisVal(reactive, _, null, null)
//   }
//   newVal['$'] = getPrimordialAttrs(primordial, process, reactive, null, null)
//   return newVal
// }

// function morgeAttrs(attrs, process) {
//   // 合并
//   let O = Object.create({})
//   for (let key in attrs) {
//     O[key] = attrs[key]
//   }
//   for (let item in process) {
//     O[item] = attrs[item]
//   }
//   return O
// }

// function getPrimordialAttrs(primordial, process, reactive, item, alias) {
//   // 获取非原生属性
//   let attrs = {}
//   for (let attr in primordial) {
//     let valStr = primordial[attr]
//     attrs[attr] = analysisVal(reactive, valStr, item, alias)
//   }
//   return morgeAttrs(attrs, process)
// }

// function analysisVal(reactive, valStr, item, alias) {
//   // 解析字符串变量 简单写法
//   // a.b.c.d
//   // alias.a
//   let data = reactive
//   console.log('valStr,  ', valStr, item, alias, '\t\r\n\t')
//   let keys = valStr.split('.')
//   for (let itemKey of keys) {
//     if (itemKey === alias) {
//       data = item
//     }
//     if (data[itemKey]) {
//       data = data[itemKey]
//     } else {
//       data = ''
//     }
//   }
//   return data
// }

// function isNotExhibition(newVal) {
//   // _isNotExhibition = false 不渲染
//   let _isNotExhibition = newVal['$'] && newVal['$']['_isNotExhibition']
//   return !_isNotExhibition
// }

// function analysisAssembly(tag, opaction) {
//   // 解析组件 @TODO
// }

// function analysisVal(reactive, valStr, item, alias) {
//   // 解析字符串变量 简单写法
//   // a.b.c.d
//   // alias.a
//   let data = reactive
//   console.log('valStr,  ', valStr, item, alias, '\t\r\n\t')
//   let keys = valStr.split('.')
//   for (let itemKey of keys) {
//     if (itemKey === alias) {
//       data = item
//     }
//     if (data[itemKey]) {
//       data = data[itemKey]
//     } else {
//       data = ''
//     }
//   }
//   return data
// }

// function xmlObject(key, value, reactive) {
//   const $ = value['$']
//   const _ = value['_']

//   // 属性
//   if ($) {
//     // 属性解析
//     value['$'] = analysisAstAttrs($, reactive)
//     // _isNotExhibition 不渲染
//     if (value['$']['_isNotExhibition']) {
//       // 不渲染
//       return false
//     }
//   }

//   // 内容
//   if (_) {
//     // 内容解析
//     value['_'] = compileContent(_, reactive)
//   }

//   for (let tager in value) {
//     if (tager !== '$' && tager !== '_') {
//       // 子标签 [] {} contetn
//       let node = value[tager]
//       if (Array.isArray(node)) {
//         // 子节点列表
//         let newAstVals = []
//         for (let nodeItem of node) {
//           if (typeof nodeItem === 'object') {
//             const newVal = xmlObject(tager, nodeItem, reactive)
//             newAstVals.push(newVal)
//           } else {
//             // @todo 这里 item 可能不是对象 不是对象不处理
//           }
//         }
//         value[tager] = newAstVals
//       } else {
//         // 单个子节点
//         value[tager] = xmlObject(tager, node, reactive)
//       }
//     }
//   }
//   return value
// }
