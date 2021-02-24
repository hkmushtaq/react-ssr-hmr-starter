import path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import LoadablePlugin from "@loadable/webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import RunNodeWebpackPlugin from 'run-node-webpack-plugin';
import NodeHotLoaderWebpackPlugin from 'node-hot-loader/NodeHotLoaderWebpackPlugin';
import WebpackNodeExternals from "webpack-node-externals";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  target: "node",
  entry: {
    main: './src/server/index.tsx',
  },
  output: {
    path: path.resolve('dist-server'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: { plugins: ['@loadable/babel-plugin'].filter(Boolean) },
          },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        use:[
          {
            loader: "css-loader",
            options: {
              modules: {
                exportOnlyLocals: true,
              },
            },
          },
        ]
      }
    ],
  },
  externals: [WebpackNodeExternals()],
  plugins: [
    new LoadablePlugin(),
    // isDevelopment && new ReactRefreshPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    isDevelopment && new NodeHotLoaderWebpackPlugin({

    }),,
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;