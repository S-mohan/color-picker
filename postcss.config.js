module.exports = {
  parser: false,
  plugins: [
    require('autoprefixer')(),
    require('cssnano')()
  ]
}