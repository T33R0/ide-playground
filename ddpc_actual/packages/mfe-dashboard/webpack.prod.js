const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const webpack = require("webpack");

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/mfe-dashboard/",
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.REACT_APP_API_URL': JSON.stringify('https://api.myddpc.com')
    }),
    new ModuleFederationPlugin({
      name: "mfe_dashboard",
      filename: "remoteEntry.js",
      exposes: {
        "./DashboardApp": "./src/App",
      },
      remotes: {
        // Align remote alias with imports like `shared_ui/button`
        shared_ui: "mf_shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
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