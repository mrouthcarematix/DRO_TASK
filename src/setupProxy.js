const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/survey',
    createProxyMiddleware({
      target: 'https://octopus.carematix.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/survey': '/peapp/user/survey',
      },
    })
  );

  app.use(
    '/api/dashboard',
    createProxyMiddleware({
      target: 'https://octopus.carematix.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/dashboard': '/peapp/user',
      },
    })
  );
};
