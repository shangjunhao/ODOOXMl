//  vue.config.js
const webpack = require('webpack')
module.exports = {
   // 配置基本url
   publicPath: './',
   // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
   outputDir: 'dist',
   // webpack-dev-server 相关配置
   devServer: { // 设置代理
      hot: true, // 热加载
      host: 'localhost', //ip地址
      port: 8888, // 端口
      // https: false, //false关闭https，true为开启
      // open: true, //自动打开浏览器
      proxy: {
         '/web/erp': { //本地 npm run dev
            target: 'https://erptest.singsong.cn',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/web/erp': '/erp'
            }
         },
         '/pre/erp': { //预发布 npm run test
            target: 'https://api.singsong.cn',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/per/erp': '/erp'
            }
         },
         '/pro/erp': { //正式 npm run build
            target: 'https://api.singsong.cn',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/pro/erp': '/erp'
            }
         },
         '/web': { //本地 npm run dev
            target: 'http://localhost:8069',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/web': '/web'
            }
         },
         '/pre': { //预发布 npm run test
            target: 'http://118.178.129.84/:8069',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/pre': '/web'
            }
         },
         '/pro': { //正式 npm run build
            target: 'http://118.178.129.84/:8069',
            changeOrigin: true,
            ws: false,
            pathRewrite: {
               '^/pro': '/web'
            }
         },
      }
   },
}
// .env.development
// VUE_APP_BASE_API='/test'