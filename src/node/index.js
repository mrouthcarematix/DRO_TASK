// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


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


const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
