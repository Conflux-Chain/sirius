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
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://scantest.confluxnetwork.org',
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpc',
    createProxyMiddleware({
      target: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
    }),
  );

  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target: 'https://scantest.confluxnetwork.org',
      changeOrigin: true,
      secure: false,
    }),
  );
};
