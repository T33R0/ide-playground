const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "https://app.myddpc.com/shared-ui/",
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
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig); 