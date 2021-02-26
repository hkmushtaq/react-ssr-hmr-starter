import path from 'path'
import nodeExternals from 'webpack-node-externals'
import LoadablePlugin from '@loadable/webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import webpack from "webpack";

const DIST_PATH = path.resolve(__dirname, 'public/dist')
const production = process.env.NODE_ENV === 'production'
const development = !production

const getConfig = (name, target) => ({
  name,
  mode: development ? 'development' : 'production',
  target,
  devtool: "source-map",
  entry: target === "web" ? [`./src/client/main-web.js`, 'webpack-hot-middleware/client?path=/auction-dashboard/__webpack_hmr'] : `./src/server/render.js`,
  module: {
    rules: [
      {
        test: /\.([jt])sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            caller: { target },
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-react',
              // [
                '@babel/preset-env',
                // {
                //   useBuiltIns: target === "web" ? 'entry' : undefined,
                //   corejs: target === "web" ? 'core-js@3' : false,
                //   targets: target !== "web" ? { node: 'current' } : undefined,
                // },
              // ],
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import', '@loadable/babel-plugin', development && target === "web" && require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  externals:
    target === 'node' ? ['@loadable/component', nodeExternals()] : undefined,

  optimization: {
    runtimeChunk: target !== 'node',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },

  output: {
    path: path.join(DIST_PATH, target),
    filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
    publicPath: `/dist/${target}/`,
    libraryTarget: target === 'node' ? 'commonjs2' : undefined,
  },
  plugins: [
    development && target === "web" &&  new webpack.HotModuleReplacementPlugin(),
  development && target === "web" && new ReactRefreshWebpackPlugin({
    overlay: {
      sockIntegration: "whm"
    }
  }),
    target === "web" && new LoadablePlugin(), target === "node" && new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }), new MiniCssExtractPlugin(),    
  ].filter(Boolean),
})

export default [getConfig('client', 'web'), getConfig('server', 'node')]
