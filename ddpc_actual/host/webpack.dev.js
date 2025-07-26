const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const devConfig = {
  mode: "development",
  devServer: {
    port: 8080, // Your host port
    historyApiFallback: true,
    hot: true,
  },
  output: {
    publicPath: "http://localhost:8080/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        mfe_home: "mfe_home@http://localhost:3002/remoteEntry.js",
        mfe_garage: "mfe_garage@http://localhost:3003/remoteEntry.js",
        shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
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

module.exports = merge(commonConfig, devConfig); 