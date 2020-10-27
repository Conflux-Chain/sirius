const path = require('path');
console.log('path', path);
module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function (config, env) {
    // ...add your webpack config
    return {
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 1,
          maxSize: 0,
          maxAsyncRequests: 30,
          maxInitialRequests: 3,
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial',
            },
            common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true,
            },
          },
        },
      },
      resolve: {
        alias: {
          'js-conflux-sdk': path.resolve(
            process.cwd(),
            'node_modules',
            'js-conflux-sdk',
          ),
        },
      },
    };
  },
};
