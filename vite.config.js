module.exports = {
  // 反向代理
  proxy: {
    '/web': {
      target: 'http://localhost:8069/web',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/web/, ''),
    },
    '/node': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/node/, ''),
    },
  },
}
