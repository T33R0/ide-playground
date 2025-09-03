const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/mfe-garage/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_garage",
      filename: "remoteEntry.js",
      exposes: {
        "./GarageApp": "./src/App",
      },
      remotes: {
        host: "host@https://app.myddpc.com/remoteEntry.js",
        shared_ui: "mf_shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: deps["react-router-dom"],
        },
        "shared-config": { singleton: true, eager: true },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig); 