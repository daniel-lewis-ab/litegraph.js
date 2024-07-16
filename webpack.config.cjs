const path = require('path');

module.exports = {
  entry: './src/litegraph.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'litegraph.bundle.js',
    library: {
      name: 'LiteGraphJS', // Can't be LiteGraph since it'll conflict with class LiteGraph
      type: 'umd'
    },
    globalObject: 'window'
  },
  mode: 'development', // or 'production'
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
