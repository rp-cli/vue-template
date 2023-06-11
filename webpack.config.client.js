const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { name } = require('./package.json');

module.exports = {
  mode: "development",
  entry: {
    main: path.join(__dirname, "src/index.js"),
  },
  // devtool: 'source-map',
  output: {
    // filename: 'bundle.js',
    path: `${__dirname}/dist`,
    library: `${name}-[name]`,
    libraryTarget: "umd", // 把微应用打包成 umd 库格式
    // jsonpFunction: `webpackJsonp_${name}`,
    // publicPath: '/public'
  },
  externals: {
    lodash: "_",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        // 命中 less 文件
        test: /\.(less | css)$/,
        // 从右到左依次使用 less-loader、css-loader、style-loader
        use: ["style-loader", "css-loader", "less-loader"],
        // 排除 node_modules 下面的 less 文件
        exclude: "/node_modules/",
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlPlugin({
      template: path.join(__dirname, "src/index.html"),
    }),
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hot: true,
    port: "8000",
  },
};
