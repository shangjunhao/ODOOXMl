// 解析文本内容
export default function compileContent(content, reactive) {
  // 节点内容 文本内容 or 代码域 @todo 允许有多个匹配到的表达式
  // @todo 匹配{{}} 匹配不到 返回内容 匹配到进行解析 并进行数据替换
  // 这里应该是在保留原字符串的基础上、替换{{}}内的表单式
  let render = normalizeOpt(content)
  let result = render(reactive)
  return result
}

function normalizeOpt(template) {
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
