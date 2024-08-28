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
        target: 'http://localhost:5000',//处理前端8080后端5000跨域问题
        changeOrigin: true,
      },
    },
  },
});
