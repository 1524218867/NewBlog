const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },

  lintOnSave: false, // 关闭 ESLint
  // 开发服务器配置不影响生产模式代理
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,             // 如果是跨域请求，需要设置为 true
       
      },
      '/uploads': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,
      },
      '/UserImg': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,
      },
    },
  },
});
