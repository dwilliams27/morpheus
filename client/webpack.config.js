const path = require('path');
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/app.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(appDirectory, "public"),
    compress: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(appDirectory, "public/index.html"),
    })
  ],
};
