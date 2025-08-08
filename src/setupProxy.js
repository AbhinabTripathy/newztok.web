// Proxy configuration disabled - using direct API calls
// const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // No proxy configuration - using direct API calls to avoid proxy-related timeouts
  console.log('Proxy middleware disabled - using direct API calls');
}; 