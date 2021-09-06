const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

module.exports = app => {
  app.use(
    '/stat',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org'
          : process.env.REACT_APP_PrivateNet === 'true'
          ? 'https://posrc.confluxscan.net/'
          : 'https://scantest.confluxnetwork.org',
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
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org'
          : process.env.REACT_APP_PrivateNet === 'true'
          ? 'https://posrc.confluxscan.net/'
          : 'https://scantest.confluxnetwork.org',
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpc',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org/rpc'
          : process.env.REACT_APP_PrivateNet === 'true'
          ? 'http://39.100.97.209:12537/rpc'
          : 'https://scantest.confluxnetwork.org/rpc',
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpcv2',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org/rpcv2'
          : process.env.REACT_APP_PrivateNet === 'true'
          ? 'http://39.100.97.209:12537/rpc'
          : 'https://scantest.confluxnetwork.org/rpcv2',
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'http://testnet-scantest.confluxnetwork.org'
          : process.env.REACT_APP_PrivateNet === 'true'
          ? 'https://posrc.confluxscan.net/'
          : 'http://scantest.confluxnetwork.org',
      changeOrigin: true,
      secure: false,
    }),
  );
};
