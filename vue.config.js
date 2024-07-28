const { defineConfig } = require('@vue/cli-service')
const path = require('path');


module.exports = defineConfig({

  transpileDependencies: true
})
// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
  lintOnSave: false, // 关闭 ESLint
};


