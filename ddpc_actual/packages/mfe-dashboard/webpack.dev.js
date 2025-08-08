const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3006,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "http://localhost:3006/",
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.REACT_APP_API_URL': JSON.stringify('http://localhost:8001')
    }),
    new ModuleFederationPlugin({
      name: "mfe_dashboard",
      filename: "remoteEntry.js",
      exposes: {
        "./DashboardApp": "./src/App",
      },
      remotes: {
        shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
        host: "host@http://localhost:8080/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);