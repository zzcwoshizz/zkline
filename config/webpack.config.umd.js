'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const paths = require('./paths');
const publicPath = '/';

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname),

  /**
   * entry
   */
  entry: {
    index: [
      path.resolve(paths.appSrc, 'index.scss'),
      path.resolve(paths.appSrc, 'index.ts'),
    ],
  },
  output: {
    filename: 'zkline.js',
    publicPath: publicPath,
    path: paths.appDist,
    libraryTarget: 'umd',
    library: 'zkline',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: paths.appSrc,
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
        loader: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve('style-loader'),
            options: {
              hmr: false,
            },
          },
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: {
                includePaths: [path.resolve(paths.appSrc, 'scss')],
              },
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve('style-loader'),
            options: {
              hmr: false,
            },
          },
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        }),
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
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
    new CleanWebpackPlugin(['*'], {
      root: paths.appDist,
    }),
    new ExtractTextPlugin({
      filename: 'zkline.css',
    }),
  ],
};
