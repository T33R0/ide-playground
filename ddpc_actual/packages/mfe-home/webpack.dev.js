const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3002,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: "http://localhost:3002/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_home",
      filename: "remoteEntry.js",
      exposes: {
        "./HomeApp": "./src/App",
      },
      remotes: {
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