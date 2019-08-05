const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = env => {
  const isProd = env.production || env === 'production'

  const config = {
    entry: {
      demo: './examples/demo.ts',
      'mo.color-picker': './src/index.ts'
    },
    output: {
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, isProd ? './dist' : './docs'),
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
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, './docs/index.html'),
        template: path.resolve(__dirname, './examples/index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          minifyCSS: true,
          minifyJS: true
        },
        chunksSortMode: 'dependency',
        chunks: ['demo', 'mo.color-picker'],
      }),
    ]
  }

  if (!isProd) {
    config.devServer = {
      contentBase: path.join(__dirname, './docs'),
      compress: true,
      hot: true,
      open: true,
      port: 8080,
    }
  }

  return config
}