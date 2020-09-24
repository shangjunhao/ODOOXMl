function normalizeOpt(options) {
  // 数据统一处理函数
  return options
}

export default function compiler(template) {
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
