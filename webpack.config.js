const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RemoveUseStrictPlugin = require(path.resolve(__dirname, './remove-use-strict-plugin'));
module.exports = {
  devServer: {
    static: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    open: true,
    hot: true,
    liveReload: true,
  },
  mode: 'development', // or 'production'
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:[
              '@babel/preset-react'
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader:'css-loader',
            options:{
              importLoaders:1
            }
          },
          'postcss-loader',
        ],
      },

    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new RemoveUseStrictPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};
