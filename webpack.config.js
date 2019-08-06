const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = env => {
  const isProd = env.production || env === 'production'

  const config = {
    entry: './src/index.ts',
    output: {
      publicPath: '/',
      filename: 'mo.color-picker.js',
      path: path.resolve(__dirname, './dist'),
      library: 'MoColorPicker',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: isProd ? false : 'source-map',
    module: {
      rules: [{
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        // es6
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader'
          }],
          exclude: /node_modules/
        },
        // scss
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ]
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'mo.color-picker.css',
        chunkFilename: 'mo.color-picker.css'
      }),
      new OptimizeCSSPlugin({ safe: true, map: false, discardComments: { removeAll: true } }),
    ]
  }

  return config
}