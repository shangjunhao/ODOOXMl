import compile from './compiler'
import { getXmlCode } from './a'
function creatApp(option) {
  // 初始化函数
  // 一、执行setUp函数获取当前组件的数据
  // 二、解析AST树、并对其中的数据进行替换、对其中的指令和组件进行再渲染
  const data = option.setUp(option.props)
  const render = compile(option.template, option)
  const ast = render(data)
  console.log(getXmlCode(ast))
}

function init(option) {
  // Vue-mini 初始化函数
  // 一、初始化参数
  // 二、初始化生命周期
  // 三、初始化数据双向绑定
  // 四、初始化计算函数、监听函数、方法
  // 五、初始化事件、初始化指令、初始化组件
  // 六、数据初始化、添加双向绑定、记录更新关系
  // 六、模版编译、解析、创建Vnode、Render函数、
}

export default creatApp
