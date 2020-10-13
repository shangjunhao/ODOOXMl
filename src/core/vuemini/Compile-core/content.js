// 解析文本内容
import { analysisVal } from './text'

export function analysisContent(content, reactive, key, val) {
  // 节点内容 文本内容 or 代码域 @todo 允许有多个匹配到的表达式
  // @todo 匹配{{}} 匹配不到 返回内容 匹配到进行解析 并进行数据替换
  // 这里应该是在保留原字符串的基础上、替换{{}}内的表单式
  if (!content) return ''
  let render = normalizeOpt(content)
  let result = render(reactive, key, val)
  // console.log('result', result, content)
  return result
}

function normalizeOpt(template) {
  return (reactive, key, val) => {
    // console.log(key, val, template)
    return template.replace(/{{(.*?)}}/g, (node, strVal) => {
      return analysisVal(reactive, strVal, key, val)
    })
  }
}
