const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const path = require("path");

// This function makes the config adapt to the build mode
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const port = process.env.PORT || 3002; // Default port for mfe-home

  // Define URLs for any remotes this MFE uses
  const remoteUrls = {
    development: {
      // Assuming shared_ui runs on port 3004 in dev
      shared_ui: "shared_ui@http://localhost:3004/remoteEntry.js",
    },
    production: {
      shared_ui: "shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
    },
  };

  return {
    entry: "./src/index",
    mode: isProduction ? "production" : "development",
    devServer: {
      port: port,
      static: {
        directory: path.join(__dirname, "dist"),
      },
    },
    output: {
      // Set the publicPath dynamically
      publicPath: isProduction ? "https://app.myddpc.com/shared-ui/" : `http://localhost:${port}/`,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "shared_ui",
        filename: "remoteEntry.js",
        exposes: {
          "./SharedUI": "./src/App",
        },
        // Set remotes dynamically
        remotes: isProduction ? remoteUrls.production : remoteUrls.development,
        shared: {
          ...deps,
          react: { singleton: true, requiredVersion: deps.react },
          "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
          "react-router-dom": { singleton: true, requiredVersion: deps["react-router-dom"] },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
  };
};
