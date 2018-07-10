'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const paths = require('./paths');
const publicPath = '/';

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname),

  /**
   * entry
   */
  entry: {
    index: path.resolve(process.cwd(), 'index.ts'),
  },
  output: {
    filename: 'static/js/[name].bundle.js',
    publicPath: publicPath,
    path: paths.appDist,
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [paths.appSrc, path.resolve(process.cwd(), 'index.ts')],
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              configFileName: paths.appTsConfig,
              useCache: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(paths.appSrc, 'scss')],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [],
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: paths.appPublic,
        to: paths.appDist,
      },
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(paths.appPublic, 'index.html'),
      filename: 'index.html',
    }),
    new CheckerPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
  ],
};
