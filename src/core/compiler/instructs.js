// 指令属性解析
import { analysisVal } from './text'

let instructs = [':', 'v-has:', 'v-if', 'v-for'] // 已有指令

export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

export function instructsRegionState(attrs, reactive) {
  // 局部变量 v-for 数据
  if (!attrs) return
  for (let attr in attrs) {
    if (attr.startsWith('v-for')) {
      const inMatch = attrs[attr].match(forAliasRE)
      const key = inMatch[1] || ''
      // val 是数组 如果不是 抛出错误
      const val = analysisVal(reactive, inMatch[2]) || []
      // 删除 防止无限递归
      delete attrs[attr]
      return { key, val }
    }
  }
}

export function analysisAstAttrs(attrs, reactive, a, b) {
  if (!attrs) return {}
  // 属性处理 (vue中这里可以进行指令、事件等处理)
  let primordial = {}
  let process = {}
  for (let attr in attrs) {
    let index = instructs.findIndex((ins) => {
      return attr.startsWith(ins)
    })
    if (index > -1) {
      let ins = instructs[index]
      let key = attr.split(instructs[index])[1]
      let val = analysisVal(reactive, attrs[attr], a, b)
      switch (ins) {
        case ':':
          primordial[key] = val
          break
        case 'v-if':
          primordial['_isNotExhibition'] = val
          break
        case 'v-has:':
          if (val !== null || val !== undefined || val !== '') {
            primordial[key] = val
          }
          break
        default:
          break
      }
    } else {
      // 原生属性
      process[attr] = attrs[attr]
    }
  }
  return morgeAttrs(primordial, process)
}

function morgeAttrs(attrs, process) {
  // 合并
  let O = Object.create({})
  for (let key in attrs) {
    O[key] = attrs[key]
  }
  for (let item in process) {
    O[item] = attrs[item]
  }
  return O
}
