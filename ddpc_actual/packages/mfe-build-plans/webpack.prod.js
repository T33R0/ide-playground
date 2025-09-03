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
      remotes: {
        // Consume shared-ui via module federation using underscore notation
        shared_ui: "mf_shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
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