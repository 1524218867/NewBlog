module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry', // 或者 'usage'，根据需要配置
        corejs: 3,  // 使用 core-js@3
      },
    ],
  ],
};
