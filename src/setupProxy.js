const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://octopus.carematix.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/peapp/user/survey', 
      },
    })
  );
};
