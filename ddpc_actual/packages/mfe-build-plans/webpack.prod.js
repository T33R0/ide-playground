const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/mfe-build-plans/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_build_plans",
      filename: "remoteEntry.js",
      exposes: {
        "./BuildPlansApp": "./src/App",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig); 