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
        // Adjust shared-ui remote name to match library identifier
        shared_ui: "mf_shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
        mfe_build_plans: "mfe_build_plans@https://app.myddpc.com/mfe-build-plans/remoteEntry.js",
        mfe_maintenance: "mfe_maintenance@https://app.myddpc.com/mfe-maintenance/remoteEntry.js",
        mfe_dashboard: "mfe_dashboard@https://app.myddpc.com/mfe-dashboard/remoteEntry.js",
        mfe_account: "mfe_account@https://app.myddpc.com/mfe-account/remoteEntry.js",
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