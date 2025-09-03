const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/mfe-account/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_account",
      filename: "remoteEntry.js",
      remotes: {
        shared_ui: "mf_shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
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
  ],
};

module.exports = merge(commonConfig, prodConfig); 