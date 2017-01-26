"use strict";

// Default webpack config for development environment only

const webpack = require("webpack");
const {resolve} = require("path");

// SHARED CONFIGURATION SETTINGS
const PORT = 9090;

// ENTRIES
const entries = [
  "react-hot-loader/patch",
  `webpack-dev-server/client?http://localhost:${PORT}`,
  "webpack/hot/only-dev-server",

  resolve(__dirname, "./src/main.js")
];

// PLUGINS
const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  // enable HMR globally

  new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates

  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    jquery: 'jquery'
  })
];

// LOADERS
const htmlLoader = {
  test: /\.html$/,
  exclude: /node_modules/,
  loader: "file-loader",
  query: {
    name: "[name].[ext]"
  }
};

const jsLoader = {
  test: /\.js$/,
  use: [
    "babel-loader",
  ],
  exclude: /node_modules/
};

// @see https://webpack.js.org/plugins/extract-text-webpack-plugin/#usage-example-with-css
const cssLoader = {
  test: /\.css$/,
  use: [
    "style-loader",
    {
      loader: 'css-loader',
      options: {
        minimize: false
      }
    },
    "postcss-loader"
  ],
};

const fontsLoader = {
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  loader: 'file-loader'
};


module.exports = {
  entry: entries,
  context: resolve(__dirname, "src"),

  output: {
    filename: "app.js",
    path: resolve(__dirname, "./dist"),
    publicPath: "/"
  },

  module: {
    rules: [
      htmlLoader,
      jsLoader,
      cssLoader,
      fontsLoader
    ],
  },

  resolve: {
    extensions: [".js"],
    modules: [
      resolve(__dirname, "node_modules"),
      resolve(__dirname, "src")
    ]
  },

  devtool: "cheap-module-eval-source-map", // @see https://webpack.js.org/configuration/devtool/#for-development

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname, "dist"),
    // match the output path

    publicPath: "/",
    // match the output `publicPath`

    port: PORT,

    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        secure: false
      }
    }
  },

  plugins: plugins
};
