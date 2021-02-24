import path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import LoadablePlugin from "@loadable/webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration, HotModuleReplacementPlugin} from "webpack";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import appRootPath from "app-root-path";

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration & { devServer: any } = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    bundle: ['webpack-hot-middleware/client','./src/client/index.tsx'],
  },
  output: {
    path: path.join(appRootPath.path, "dist"),
    filename: '[name].js',
    publicPath: "/"
  },
  devServer: {
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: { plugins: [ isDevelopment && 'react-refresh/babel', '@loadable/babel-plugin'].filter(Boolean) },
          },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use:[
          MiniCssExtractPlugin.loader, 
          {
            loader: "css-loader",
            options: {
              modules: true
            },
          },
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new LoadablePlugin(),
    isDevelopment && new ReactRefreshPlugin(
      {
        overlay: {
          sockIntegration: 'whm',
        },
      }
    ),
    isDevelopment && new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: './index.html',
    //   template: './public/index.html',
    // }),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;