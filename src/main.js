import creatApp from './core/compiler/index'
import pageItem from './page/ss_sample/data'
import useAppCode from './core/temp/App/index'

// 单一模型的视图、权限处理
// 一、根据配置数据获取单个模型的数据(模型、字段) 并初步处理
// 二、获取根组件
;(async () => {
  for (let pageItemData of [pageItem]) {
    // useAppCode.data = pageItemData
    await creatApp(useAppCode(pageItemData))
  }
})()

// import { createApp } from 'vue'
// import App from './assets/App.vue'
// createApp(App).mount('#app')

// 生成文件入口
// import datas from './data'
// import usePageViews from './components/page'
// ;(async () => {
//   const data = datas[0]
//   const xml = (await usePageViews(data)) || ''
//   const content = `<data>${xml}</data>`
//   console.log(content)
// })()

// 渲染函数
// import xmlJson from './code/data.json'
// import { render } from './code/odoo-xml-compiler'
// console.log(xmlJson, render)
// console.log(render({}, xmlJson, {}))

// 页面测试
// import { useTreeView } from './core/temp/table/view/tree'

// let { tree } = useTreeView({})

// 接口测试
// import porps from './page/ss_sample/data'
// import { convertModel } from './core/utils/odoo-utils'
// import { getFields, getModels } from './core/server/odoo-http'

// getModels(porps.key, porps.module).then((res) => {
//   console.log(convertModel(res.records[0]))
// })

// 模版解析测试 失败
// import { readXmlToAst } from './core/server/odoo-http-xml2ast'

// readXmlToAst(
//   '/../temp/form/index.xml',
//   '/../../dist/ss_sample/product_template_tree_h.xml',
//   {}
// )
// console.log(2)
