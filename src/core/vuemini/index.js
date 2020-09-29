import compile from './Compile-core/compiler'
// Vue-mini 主程序
function creatApp(option) {
  // 初始化函数
  // 一、执行setUp函数获取当前组件的数据
  // 二、解析AST树、并对其中的数据进行替换、对其中的指令和组件进行再渲染
  const data = option.setUp(option.props)
  const render = compile(option.template)
  const xml = render(data)
  console.log(xml)
}

function init(option) {
  // 初始化函数
}

export default creatApp
