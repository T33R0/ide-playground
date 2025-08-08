const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/mfe-maintenance/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfe_maintenance",
      filename: "remoteEntry.js",
      exposes: {
        "./MaintenanceApp": "./src/App",
      },
      remotes: {
        "shared-ui": "mf-shared-ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "shared-config": { singleton: true, eager: true },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig); 