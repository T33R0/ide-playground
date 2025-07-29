const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3003,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: "http://localhost:3003/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_garage",
      filename: "remoteEntry.js",
      exposes: {
        "./GarageApp": "./src/App",
      },
      remotes: {
        host: "host@http://localhost:8080/remoteEntry.js",
        shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
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