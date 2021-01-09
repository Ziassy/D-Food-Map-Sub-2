/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { InjectManifest } = require('workbox-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: path.resolve(__dirname, 'src/scripts/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader?url=false',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              disable: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/templates/index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new WebpackPwaManifest({
      name: 'Food Map',
      short_name: 'Food Map',
      description: 'Find more restaurants',
      start_url: './index.html',
      display: 'standalone',
      background_color: '#FFAA00',
      theme_color: '#FFAA00',
      fingerprints: false,
      ios: true,
      crossorigin: 'anonymous',
      icons: [
        {
          src: path.resolve('src/public/icons/icon.png'),
          destination: path.join('icons', 'android'),
          sizes: [192, 256, 384, 512],
          purpose: 'any maskable',
        },
        {
          src: path.resolve('src/public/icons/icon.png'),
          destination: path.join('icons', 'ios'),
          sizes: [192, 256, 384, 512],
          purpose: 'any maskable',
          ios: true,
        },
      ],
    }),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
