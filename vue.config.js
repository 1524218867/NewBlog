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

  devServer: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:3000',//处理前端8080后端5000跨域问题
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3000', // 代理 /api 请求到后端
        changeOrigin: true,
        // pathRewrite: { '^/api': '' }, // 如果后端没有 `/api` 前缀，可以进行路径重写
      },
    },
  },
});
