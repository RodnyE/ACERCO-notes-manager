
const cfg = require('./config')
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';


module.exports = {
    entry: path.join(cfg.SRC, 'index.js'),
    mode: process.env.NODE_ENV,
    output: {
        path: cfg.DIST,
        filename: "bundle.js",
    },
    devServer: {
        contentBase: cfg.DIST,
        port: cfg.PORT + 1,
        host: 'localhost',
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(cfg.PUBLIC, 'index.html'),
        }),
    ],
    resolve: {
        alias: {
            "ui": cfg.SRC + "/ui",
            "utils": cfg.SRC + "/utils",
            "assets": cfg.SRC + "/assets",
            "context": cfg.SRC + "/views/__context.jsx",
            "eruda": isProduction ? 
                cfg.SRC + "/utils/__eruda-fake.js" :
                "eruda",
        },
        extensions: ["*", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(otf|jpg|png|svg)$/i,
                type: 'asset',
            },
        ],
    },
};