const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const path = require("path");

// This function now uses the environment variables from your package.json scripts
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Read ports from the environment variables set by cross-env
  const devPorts = {
    host: process.env.PORT || 8080,
    mfe_home: process.env.MFE_HOME_PORT || 3001,
    mfe_garage: process.env.MFE_GARAGE_PORT || 3002,
    shared_ui: process.env.SHARED_UI_PORT || 3003,
    // Add other MFEs here if needed
  };

  const MFE_URLS = {
    development: {
      mfe_home: `mfe_home@http://localhost:${devPorts.mfe_home}/remoteEntry.js`,
      mfe_garage: `mfe_garage@http://localhost:${devPorts.mfe_garage}/remoteEntry.js`,
      shared_ui: `shared_ui@http://localhost:${devPorts.shared_ui}/remoteEntry.js`,
    },
    production: {
      mfe_home: "mfe_home@https://app.myddpc.com/mfe-home/remoteEntry.js",
      mfe_garage: "mfe_garage@https://app.myddpc.com/mfe-garage/remoteEntry.js",
      shared_ui: "shared_ui@https://app.myddpc.com/shared-ui/remoteEntry.js",
    },
  };

  return {
    entry: "./src/index",
    mode: isProduction ? "production" : "development",
    devServer: {
      port: devPorts.host,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      historyApiFallback: true,
      hot: true,
    },
    output: {
      publicPath: isProduction ? "https://app.myddpc.com/" : `http://localhost:${devPorts.host}/`,
    },
    optimization: {
      // This is the key fix: prevents bundling remote code into the host
      splitChunks: isProduction ? { chunks: 'async' } : false,
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
        name: "host",
        filename: "remoteEntry.js",
        exposes: {
          './eventBus': './src/utils/eventBus',
        },
        remotes: isProduction ? MFE_URLS.production : MFE_URLS.development,
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
