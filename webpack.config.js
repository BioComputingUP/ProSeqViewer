module.exports = {
  entry: './dist/index.js',
  output: {
    filename: 'sqv-bundle.js'
  },
  optimization: {
    minimize: false
  },
  mode: "production"
};
