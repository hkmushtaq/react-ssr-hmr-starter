import path from 'path'
import express from 'express'

const app = express()

// https://github.com/gregberge/loadable-components/issues/634
// app.use('*/runtime~main.js', async (req, res, next) => {
//   console.log('delaying runtime chunk');
//   await new Promise(resolve => setTimeout(resolve, 2000));
//   next();
// });

app.use(express.static(path.join(__dirname, '../../public')))

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const { default: webpackConfig } = require('../../webpack.config')
  const webpack = require('webpack')
  /* eslint-enable global-require, import/no-extraneous-dependencies */

  const compiler = webpack(webpackConfig)
console.log("Test")
  app.use(
    webpackDevMiddleware(compiler, {
      serverSideRender: true,
      // logLevel: 'silent',
      // publicPath: '/dist/web/',
      writeToDisk(filePath) {
        return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath)
      },
    }),
  )
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client'), {
    path: "/auction-dashboard/__webpack_hmr"
  }));
  app.use(webpackHotServerMiddleware(compiler));

}

// const nodeStats = path.resolve(
//   __dirname,
//   '../../public/dist/node/loadable-stats.json',
// )

// const webStats = path.resolve(
//   __dirname,
//   '../../public/dist/web/loadable-stats.json',
// )

// app.get('*', (req, res) => {
//   const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
//   const { default: App } = nodeExtractor.requireEntrypoint()

//   const webExtractor = new ChunkExtractor({ statsFile: webStats })
//   const jsx = webExtractor.collectChunks(<App />)

//   const html = renderToString(jsx)

//   res.set('content-type', 'text/html')
//   res.send(`
//       <!DOCTYPE html>
//       <html>
//         <head>        
//         ${webExtractor.getLinkTags()}
//         ${webExtractor.getStyleTags()}
//         </head>
//         <body>
//           <div id="main">${html}</div>
//           <script>console.log('html is loaded')</script>          
//           ${webExtractor.getScriptTags()}
//           <script>console.log('html is ready')</script>
//         </body>
//       </html>
//     `)
// })

// eslint-disable-next-line no-console
app.listen(9000, () => console.log('Server started http://localhost:9000'))
