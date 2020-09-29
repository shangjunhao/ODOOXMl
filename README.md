# 问题记录

## 问题一

```
场景: 给表格数据增加必须、只读等属性、数据权限过滤

说明: 假设有一组表格数据 D、数据请求在父组件 P 中(因为子组件只关心单条数据的渲染)、但表格的数据需要处理后才能在子组件 C 中使用、且表格中的数据只有部分渲染

问题: 表格的数据处理应该放在父组件还是子组件?怎样更利于优化、怎样更利于维护

思考:

    在父组件中处理会导致父组件逻辑混乱、且增加了部分无效的数据处理
    在子组件中处理则需要维护父子通信的数据量、因数据处理需要表格之外的数据辅助
    总结来说就是子组件是接收参数内部计算渲染、还是结束数据只负责渲染
```

## 问题二

```
问题 use 组件的异步问题
```

## 问题三

```
问题 xml 生成思路过程中联想到一个问题: 为什么需要一个 Render 函数

猜测 因为需要使用 JS 生成和控制 DOM 而不是生成视图代码整体替换?

```

## 问题四

问题 整体的渲染流程、当本地运行时、当服务端渲染时 vue 是如何运行的

## 问题五

vue 是如何做到局部更新的、哪里的数据变更变哪里

## 问题六

怎么样在项目中混用 require 和 import

# 前端变化过程

1、前后端不分离

`( 前端模版 + 数据库语言、后端语言 ) => 数据整理、渲染 => 最终页面`

2、前后端分离 JQ 时代 MVC

`基础页面 => 数据请求、计算 => 代码片段( 模版组件正则替换 || 字符串拼接 ) => DOM 操作 => 最终页面`

3、前后端分离 VUE 时代 MVC、MVVM

`带指令组件模版 => 模版解析 => 渲染函数 => 数据请求、计算 => 触发视图自动渲染更新 => 最终页面`

# xml 生成思路过程

## 生成过程:

```
xml 模版 => ast => 指令解析、数据替换 => 数据渲染 JSON => 遍历 JSON 生成视图代码

xml 模版 => ast => 指令解析、数据替换 => 数据渲染后的 AST => xml2js 通过 AST 生成 xml 代码
```

## 包含列表处理:

```
<!-- 方法一 -->
{{tree.fields}}


<!-- 方法二 子组件渲染 -->
<v-field v-for="item in tree.fields"></v-field>
```

# END @todo

代码注释、测试案例、使用文档、文章总结

# Other

```
// @todo 属性统一处理 不需要额外改动本页面代码
// @question 是应该在外部处理数据 还是组件内只关心如何渲染
// 将数据处理放在组件内部: 整体的业务逻辑更清晰、且外部的数据并不一定需要全部渲染
// 但当某一数据有多个组件同时需要时, 可将其放在父组件中统一处理
// @solution 这里只关心部分常见的属性配置、其余的属性配置通过 “xml 修改” 完成
```

# vite 配置

```
const fs = require('fs')
const dotenv = require('dotenv')
const envFiles = [
  /** default file */ `.env`,
  /** mode file */ `.env.${process.env.NODE_ENV}`,
]
for (const file of envFiles) {
  const envConfig = dotenv.parse(fs.readFileSync(file))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

module.exports = {
  alias: {},
  hostname: process.env.VITE_HOST,
  port: process.env.VITE_PORT,
  // 是否自动在浏览器打开
  open: true,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  /**
   * Base public path when served in production.
   * @default '/'
   */
  base: process.env.VITE_BASE_URL,
  /**
   * Directory relative from `root` where build output will be placed. If the
   * directory exists, it will be removed before the build.
   * @default 'dist'
   */
  outDir: process.env.VITE_OUTPUT_DIR,
  // 反向代理
  proxy: {
    web: {
      target: 'http://localhost:8069',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/web/, ''),
    },
  },
}

```
