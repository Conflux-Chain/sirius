const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

// const url = 'https://www-stage.confluxscan.net';

const configs = {
  core_mainnet_url: 'https://confluxscan.net/',
  core_testnet_url: 'https://testnet-stage.confluxscan.org/',
  core_devnet_url: 'https://net8888cfx.confluxscan.net/',
};
let url = configs.core_mainnet_url;
if (process.env.REACT_APP_CORE_TESTNET === 'true') {
  url = configs.core_testnet_url;
} else if (process.env.REACT_APP_CORE_DEVNET === 'true') {
  url = configs.core_devnet_url;
}

module.exports = app => {
  app.use(
    '/stat',
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
  // test api with backend dev service
  // app.use(
  //   '/v1',
  //   createProxyMiddleware({
  //     target: 'http://scan-dev-service.conflux-chain.org:8895/',
  //     changeOrigin: true,
  //     secure: false,
  //   }),
  // );
  app.use(
    '/v1',
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpc',
    createProxyMiddleware({
      target: `${url}/rpc`,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpcv2',
    createProxyMiddleware({
      target: `${url}/rpcv2`,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
};
