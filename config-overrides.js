const path = require('path');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin({
  disable: !process.env.MEASURE,
  outputFormat: 'humanVerbose',
  loaderTopFiles: 10,
});

module.exports = function (config, mode) {
  if (mode === 'production') {
    return smp.wrap({
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
        minimizer: config.optimization.minimizer.map(minimizerConfig => {
          if (
            !minimizerConfig ||
            !minimizerConfig.options ||
            !minimizerConfig.options.parallel
          )
            return minimizerConfig;
          minimizerConfig.options.parallel = 1;
          return minimizerConfig;
        }),
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
          react: path.resolve(__dirname, './node_modules/react'),
          'react-router-dom': path.resolve(
            __dirname,
            './node_modules/react-router-dom',
          ),
          'react-i18next': path.resolve(
            __dirname,
            './node_modules/react-i18next',
          ),
        },
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.js?$/,
            include: /(node_modules\/(@cfxjs\/use-wallet-react)|(ethers))/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-transform-class-properties',
                  '@babel/plugin-transform-private-methods',
                ],
              },
            },
          },
          {
            test: /\.mjs$/,
            include: /node_modules\/@mosshqqmosi/,
            type: 'javascript/auto',
          },
        ],
      },
    });
  }
  return smp.wrap({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        react: path.resolve(__dirname, './node_modules/react'),
        'react-router-dom': path.resolve(
          __dirname,
          './node_modules/react-router-dom',
        ),
        'react-i18next': path.resolve(
          __dirname,
          './node_modules/react-i18next',
        ),
      },
    },
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.js?$/,
          include: /(node_modules\/(@cfxjs\/use-wallet-react)|(ethers))/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-transform-class-properties',
                '@babel/plugin-transform-private-methods',
              ],
            },
          },
        },
        {
          test: /\.mjs$/,
          include: /node_modules\/@mosshqqmosi/,
          type: 'javascript/auto',
        },
      ],
    },
  });
};
