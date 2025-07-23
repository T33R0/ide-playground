const { ModuleFederationPlugin } = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = (env, argv) => ({
  entry: './src/bootstrap.tsx',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
  output: {
    publicPath: 'auto',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      exposes: {
        './eventBus': './src/utils/eventBus',
      },
      remotes: {
        mfe_template: 'mfe_template@http://localhost:3001/remoteEntry.js',
        mfe_home: 'mfe_home@http://localhost:3001/remoteEntry.js',
        mfe_garage: 'mfe_garage@http://localhost:3002/remoteEntry.js',
        shared_ui: 'shared_ui@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: deps['react-router-dom'],
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
});
