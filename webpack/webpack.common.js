const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const srcDir = path.join(__dirname, '..', 'src');
const entryDir = path.join(__dirname, '..', 'src/entry');
const ExtReloader = require('webpack-ext-reloader');

module.exports = {
  entry: {
    popup: path.join(entryDir, 'popup/index.tsx'),
    options: path.join(entryDir, 'options/index.tsx'),
    background: path.join(entryDir, 'background/index.ts'),
    content_script: path.join(entryDir, 'contentScript/index.tsx'),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
    clean: true,
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: 'css-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': srcDir,
    },
  },
  plugins: [
      new ExtReloader(),
      new CopyPlugin({
          patterns: [{ from: '.', to: '../', context: 'public' }],
          options: {},
      }),
      new webpack.ProvidePlugin({
          process: 'process/browser',
      }),
  ],
};
