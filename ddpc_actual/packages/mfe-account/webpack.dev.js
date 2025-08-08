const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3009,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: "http://localhost:3009/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_account",
      filename: "remoteEntry.js",
      remotes: {
        shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
      },
      exposes: {
        "./AccountApp": "./src/App",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
        "shared-config": { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig); 