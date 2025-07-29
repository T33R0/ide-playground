const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3004,
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: "http://localhost:3004/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shared_ui",
      filename: "remoteEntry.js",
      exposes: {
        "./button": "./src/components/ui/button",
        "./card": "./src/components/ui/card",
        "./progress": "./src/components/ui/progress",
        "./badge": "./src/components/ui/badge",
        "./checkbox": "./src/components/ui/checkbox",
        "./toaster": "./src/components/ui/toaster",
        "./sonner": "./src/components/ui/sonner",
        "./tooltip": "./src/components/ui/tooltip",
        "./utils": "./src/lib/utils",
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