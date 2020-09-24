// import { createApp } from 'vue'
// import App from './assets/App.vue'
// createApp(App).mount('#app')

// 生成文件入口
import datas from './data'
import usePageViews from './components/page'
;(async () => {
  const data = datas[0]
  const xml = (await usePageViews(data)) || ''
  const content = `<data>${xml}</data>`
  console.log(content)
})()
