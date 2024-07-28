const path = require('path'); // 引入 path 模块
const webpack = require('webpack'); // 引入 Webpack

const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 用于处理 Vue 文件
module.exports = {

    mode: 'development', // 设置 Webpack 的模式
    entry: {
        main: './src/main.js', // 主要入口点

    },

    output: {
        filename: '[name].bundle.js', // 输出文件名
        path: path.resolve(__dirname, 'dist'), // 输出目录
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 匹配 JavaScript 文件
                exclude: /node_modules/, // 排除 node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // 使用预设
                    },
                },
            },
            {
                test: /\.css$/, // 匹配 CSS 文件
                use: ['style-loader', 'css-loader'], // 处理 CSS
            },
            {
                test: /\.vue$/, // 匹配 Vue 文件
                use: 'vue-loader', // 使用 vue-loader 来处理 .vue 文件
            },
            {
                test: /\.less$/, // 处理 Less 文件
                use: ['style-loader', 'css-loader', 'less-loader'], // 添加 less-loader
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/, // 处理图片文件
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[myimgs].[hash:8].[ext]', // 包括 [hash] 以确保唯一
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',  // 对所有模块启用代码分割
            minSize: 20000, // 最小块大小
            minChunks: 1,  // 最小重复次数
            name: (module, chunks, cacheGroupKey) => `${cacheGroupKey}-${chunks.map(c => c.name).join('-')}`,
        },
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery', // 确保全局可用
        }),
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    stats: {
        all: true,
        errors: true,
        warnings: true,
        timings: true,
    }, devServer: {
        proxy: {
            ws: false
        }
    }
};
