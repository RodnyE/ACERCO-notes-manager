const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const cfg = require('./config');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: path.join(cfg.SRC, 'index.js'),
  mode: process.env.NODE_ENV,
  devtool: isProduction ? false : 'source-map',
  output: {
    path: cfg.DIST,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: cfg.DIST,
    port: cfg.PORT + 1,
    host: 'localhost',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(cfg.PUBLIC, 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(cfg.PUBLIC, '*'), to: cfg.DIST }],
    }),
  ],
  resolve: {
    alias: {
      'ui': path.join(cfg.SRC, 'ui'),
      'utils': path.join(cfg.SRC, 'utils'),
      'assets': path.join(cfg.SRC, 'assets'),
      'context': path.join(cfg.SRC, 'views/__context.jsx'),
      eruda: isProduction ? require.resolve('node-noop') : 'eruda',
    },
    extensions: ['*', '.js', '.jsx'],
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
      {
        test: /\.(json)$/i,
        type: 'javascript/auto',
        loader: 'null-loader',
      },
    ],
  },
};
