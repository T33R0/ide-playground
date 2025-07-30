const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 8080, // Your host port
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "http://localhost:8080/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      exposes: {
        "./eventBus": "./src/utils/eventBus",
      },
      remotes: {
        mfe_home: "mfe_home@http://localhost:3002/remoteEntry.js",
        mfe_garage: "mfe_garage@http://localhost:3003/remoteEntry.js",
        shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
        mfe_build_plans: "mfe_build_plans@http://localhost:3005/remoteEntry.js",
        mfe_dashboard: "mfe_dashboard@http://localhost:3006/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig); 