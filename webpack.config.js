const path = require("path")
const webpack = require("webpack")
const { merge } = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")

const dev = process.env.NODE_ENV === "development"

const common = {
  context: path.resolve(__dirname, "."),
  mode: process.env.NODE_ENV,
  ...(dev ? { devtool: "eval-source-map" } : {}),
  output: {
    filename: "bundle.[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.ts$/,
        use: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.(woff2?|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new VueLoaderPlugin(),
  ],
}

const editorElectronMain = merge(common, {
  entry: {
    editorElectronMain: "./src/editor/electronMain.ts",
  },
  target: "electron-main",
  output: {
    filename: "editorElectron.js",
  },
})

const editorElectronPreload = merge(common, {
  entry: {
    editorElectronPreload: "./src/editor/electronPreload.ts",
  },
  target: "electron-preload",
  output: {
    filename: "editorPreload.js",
  },
})

const editorElectronRenderer = merge(common, {
  entry: {
    editorElectronRenderer: "./src/editor/electronRenderer.ts",
  },
  target: "electron-renderer",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Events editor",
      template: "./src/editor/index.html",
    }),
  ],
})

module.exports = [
  editorElectronMain,
  editorElectronPreload,
  editorElectronRenderer,
]
