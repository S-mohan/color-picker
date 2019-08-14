const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const pkg = require('./package.json')

const banner = `${pkg.name} v${pkg.version}\n(c) 2019 Smohan<https://smohan.net>.\nReleased under the MIT License.\nhttps://smohan.net/blog/d5uvpu`

module.exports = env => {
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
    devtool: 'source-map',
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
      new webpack.BannerPlugin(banner)
    ]
  }

  return config
}