const path = require('path');
module.exports = function (config, mode) {
  if (mode === 'production') {
    return {
      ...config,
      optimization: {
        ...config.optimization,
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
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          'js-conflux-sdk': path.resolve(
            process.cwd(),
            'node_modules',
            'js-conflux-sdk',
          ),
        },
      },
    };
  }
  return config;
};
