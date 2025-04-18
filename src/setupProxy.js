const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // API Proxy
  app.use(
    ['/api', '/socket.io', '/ws'],
    createProxyMiddleware({
      target: 'http://13.234.42.114:3333', // Your API server
      changeOrigin: true,
      ws: true, // Enable WebSocket proxying
      secure: false,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.log('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong with the proxy: ' + err.message);
      }
    })
  );
}; 