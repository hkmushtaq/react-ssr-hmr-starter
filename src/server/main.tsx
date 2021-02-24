import path from 'path'
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import appRootPath from "app-root-path";

import App from '../client/App'

const app = express()

app.use(express.static(path.join(appRootPath.path, "dist")))

if (process.env.NODE_ENV !== 'production') {
    // Step 1: Create & configure a webpack compiler
    var webpack = require('webpack');
    var {default: webpackConfig} = require('../../webpack.config');
    var compiler = webpack(webpackConfig);
  
    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(
      require('../../node_modules/webpack-dev-middleware')(compiler, {
        serverSideRender: false,
        publicPath: '/',
        writeToDisk(filePath) {
          return true;
        },
      })
    );
  
    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(
      require('../../node_modules/webpack-hot-middleware')(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        
        heartbeat: 10 * 1000,
      })
    );
}


// const nodeStats = path.resolve(
//   __dirname,
//   '../../public/dist/node/loadable-stats.json',
// )

const webStats = path.resolve(
  __dirname,
  '../dist/loadable-stats.json',
)

app.get('*', (req, res) => {
  // const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
  // const { default: App } = nodeExtractor.requireEntrypoint()

  const webExtractor = new ChunkExtractor({ statsFile: webStats, entrypoints: ["bundle"] })
  const jsx = webExtractor.collectChunks(<App />)

  const html = renderToString(jsx)

  res.set('content-type', 'text/html')
  res.send(`
      <!DOCTYPE html>
      <html>
        <head>
        ${webExtractor.getLinkTags()}
        ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="main">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
    `)
})

export default app;
