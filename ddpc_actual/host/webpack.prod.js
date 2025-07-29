const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js", // For better browser caching
    publicPath: "https://app.myddpc.com/", // Your production URL
  },
  optimization: {
    splitChunks: {
      chunks: "async",
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        mfe_home: "mfe_home@https://app.myddpc.com/mfe-home/remoteEntry.js",
        mfe_garage: "mfe_garage@https://app.myddpc.com/mfe-garage/remoteEntry.js",
        shared_ui: "shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
        mfe_build_plans: "mfe_build_plans@https://app.myddpc.com/mfe-build-plans/remoteEntry.js",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
        "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig); 