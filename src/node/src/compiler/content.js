// 解析文本内容
const { analysisVal } = require('./text')

function analysisContent(content, reactive, ctx) {
  // 节点内容 文本内容 or 代码域 @todo 允许有多个匹配到的表达式
  // @todo 匹配{{}} 匹配不到 返回内容 匹配到进行解析 并进行数据替换
  // 这里应该是在保留原字符串的基础上、替换{{}}内的表单式
  if (!content) return ''
  let render = normalizeOpt(content)
  let result = render(reactive, ctx)
  return result
}

function normalizeOpt(template) {
  return (reactive, ctx) => {
    return template.replace(/{{(.*?)}}/g, (node, strVal) => {
      return analysisVal(reactive, strVal, ctx)
    })
  }
}

module.exports = {
  analysisContent,
}
