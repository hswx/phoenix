const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, './src/index.jsx'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name]_[chunkhash:8].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "./public/index.html"),
      inject: 'body',
    }),
  ]
};
