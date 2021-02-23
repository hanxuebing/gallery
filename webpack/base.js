const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const GitRevisionPlugin = require("git-revision-webpack-plugin");
// const gitRevisionPlugin = new GitRevisionPlugin({
//   lightweightTags: true,
// });
const __currentDir = "water2d";

module.exports = {
  mode: "development",
  entry: "./src/" + __currentDir + "/index.ts",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader",
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../src/"),
    publicPath: "/",
    // host: "localhost",
    port: 8080,
    open: true,
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: "./src/" + __currentDir + "/index.html",
      title: __currentDir,
    }),
    // gitRevisionPlugin,
    // new webpack.DefinePlugin({
    //   VERSION: JSON.stringify(gitRevisionPlugin.version()),
    //   COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
    //   BRANCH: JSON.stringify(gitRevisionPlugin.branch()),
    // }),
  ],
};