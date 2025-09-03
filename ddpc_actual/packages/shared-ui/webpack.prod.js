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
      // Library name cannot contain dashes when using the default 'var' type
      // Use an underscore so other remotes can consume it as `mf_shared_ui`
      name: "mf_shared_ui",
      filename: "remoteEntry.js",
      exposes: {
        "./button": "./src/components/ui/button",
        "./card": "./src/components/ui/card",
        "./progress": "./src/components/ui/progress",
        "./badge": "./src/components/ui/badge",
        "./alert": "./src/components/ui/alert",
        "./dialog": "./src/components/ui/dialog",
        "./input": "./src/components/ui/input",
        "./label": "./src/components/ui/label",
        "./checkbox": "./src/components/ui/checkbox",
        "./toaster": "./src/components/ui/toaster",
        "./sonner": "./src/components/ui/sonner",
        "./tooltip": "./src/components/ui/tooltip",
        "./use-tier": "./src/hooks/use-tier",
        "./context/tier-context": "./src/context/tier-context",
        "./tier-upsell": "./src/components/ui/tier-upsell",
        "./tier-switcher": "./src/components/ui/tier-switcher",
        "./utils": "./src/lib/utils",
        "./api": "./src/api.ts",
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