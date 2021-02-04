const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example
// module.exports = app => {
//   app.use(
//     '/api/token/list',
//     createProxyMiddleware({
//       target: 'https://yapi.conflux-chain.org/mock/',
//       pathRewrite: {
//         '/api/token/list': '/65/token/list',
//       },
//       changeOrigin: true,
//       secure: false,
//     }),
//   );
//   app.use(
//     '/api/contract-manager',
//     createProxyMiddleware({
//       target: 'https://testnet-scantest.confluxscan.io',
//       pathRewrite: {
//         '/api/contract-manager': '/contract-manager/api',
//       },
//       changeOrigin: true,
//       secure: false,
//     }),
//   );
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://scantest.confluxscan.io',
//       changeOrigin: true,
//       secure: false,
//     }),
//   );
//   app.use(
//     '/rpc',
//     createProxyMiddleware({
//       target: 'http://testnet-jsonrpc.conflux-chain.org:12537',
//     }),
//   );
// };

module.exports = app => {
  // temp use for top N
  app.use(
    '/stat',
    createProxyMiddleware({
      // target:
      //   process.env.REACT_APP_TestNet === 'true'
      //     ? 'https://testnet-scantest.confluxnetwork.org'
      //     : 'https://scantest.confluxnetwork.org',
      // target: 'http://47.242.229.73', // only for dev
      target: 'https://testnet.confluxscan.io', // only for dev
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/v1',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org'
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
          : 'https://scantest.confluxnetwork.org/rpc',
      changeOrigin: true,
    }),
  );
  app.use(
    '/rpcv2',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'https://testnet-scantest.confluxnetwork.org/rpcv2'
          : 'https://scantest.confluxnetwork.org/rpcv2',
      changeOrigin: true,
    }),
  );
  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target:
        process.env.REACT_APP_TestNet === 'true'
          ? 'http://testnet-scantest.confluxnetwork.org'
          : 'http://scantest.confluxnetwork.org',
      changeOrigin: true,
      secure: false,
    }),
  );
};
