const React = require('react');
const ChunkExtractor = require("@loadable/server").ChunkExtractor;
const renderToString = require('react-dom/server').renderToString;
const App = require('../client/App').default;
const path = require("path");
const appRootPath = require("app-root-path");

// const nodeStats = path.resolve(
//     __dirname,
//     '../../dist/node/loadable-stats.json',
//   )
  
  const webStats = path.join(
    appRootPath.path,
    'public/dist/web/loadable-stats.json',
  )

  console.log(
    webStats
  )

module.exports = function serverRenderer({ clientStats, serverStats, foo }) {
    return (req, res, next) => {
        // const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
        // const { default: App } = nodeExtractor.requireEntrypoint()
      
        const webExtractor = new ChunkExtractor({ statsFile: webStats })
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
                <script>console.log('html is loaded')</script>          
                ${webExtractor.getScriptTags()}
                <script>console.log('html is ready')</script>
              </body>
            </html>
          `)
    };
}