const path = require('path');

module.exports = {
  // Enter through index.ts
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [{
      // Match .ts[x] files
      test: /\.tsx?$/,
      // Transpile them using the ts-loader
      use: 'ts-loader',
      // Exclude files in node modules
      exclude: /node_modules/,
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    // filename: 'sqv-bundle.js'
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    // Treat as a library
    library: {
      name: 'proseqviewer',
      type: "umd",
    },
  },
  // optimization: {
  //   minimize: true
  // },
  mode: "development",
};
