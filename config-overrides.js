const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin({
  disable: !process.env.MEASURE,
  outputFormat: 'humanVerbose',
  loaderTopFiles: 10,
});

// Preserve empty CSS custom properties used by the shared UI styles.
function configureCssNano(minimizer) {
  if (minimizer?.constructor.name === 'CssMinimizerPlugin') {
    const options = minimizer.options.minimizer.options;
    options.preset = options.preset || ['default'];
    if (Array.isArray(options.preset)) {
      options.preset[1] = {
        ...options.preset[1],
        discardEmpty: false,
      };
    }
  }
  return minimizer;
}

module.exports = function (config, mode) {
  config.cache.buildDependencies.config.push(__filename);
  const scope = path.join(__dirname, 'node_modules', '@cfxjs');
  const common = fs.realpathSync(path.join(scope, 'sirius-next-common'));
  const i18n = fs.realpathSync(path.join(scope, 'sirius-next-i18n'));
  // Installed and linked packages can resolve differently at the same version.
  config.cache.version = JSON.stringify([config.cache.version, common, i18n]);

  if (mode === 'development') {
    // WDS checks raw browser stacks synchronously, before source maps are read.
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        dependencies: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'static/js/dependencies/[id].js',
          enforce: true,
          priority: 10,
        },
      },
    };
  }

  // These releases publish source maps with missing sources or invalid URLs.
  const sourceMapRule = config.module.rules.find(
    rule =>
      rule &&
      rule.enforce === 'pre' &&
      /[\\/]source-map-loader[\\/]/.test(rule.loader),
  );
  if (sourceMapRule) {
    const brokenMaps = [
      /\/node_modules\/@walletconnect\/(environment|events|jsonrpc-utils|safe-json|time|window-getters|window-metadata)\/dist\//,
      /\/node_modules\/jsbi\/dist\/jsbi-umd\.js$/,
      /\/node_modules\/@cfxjs\/antd\/dist\/@cfxjs\/antd\.css$/,
    ];
    sourceMapRule.options = {
      ...sourceMapRule.options,
      filterSourceMappingUrl: (_, resourcePath) => {
        const file = resourcePath.split(path.sep).join('/');
        // The CoffeeScript worker embeds the source map marker in a string.
        if (
          file.endsWith(
            '/node_modules/ace-builds/src-noconflict/worker-coffee.js',
          )
        ) {
          return 'skip';
        }
        return brokenMaps.some(pattern => pattern.test(file))
          ? 'remove'
          : 'consume';
      },
    };
  }

  // These large brand SVGs are only used as image URLs.
  config.module.rules
    .find(rule => rule && rule.oneOf)
    .oneOf.unshift({
      test: /[\\/]images[\\/](?:core-space|espace)[\\/]logo(?:-testnet)?\.svg$/,
      type: 'asset/resource',
    });

  // Webpack 5 resolves absolute package aliases before their package metadata.
  const moduleScope = config.resolve.plugins.find(
    plugin => plugin.constructor.name === 'ModuleScopePlugin',
  );
  if (moduleScope) {
    moduleScope.allowedPaths.push(
      path.resolve(__dirname, 'node_modules') + path.sep,
    );
  }

  // Webpack 5 no longer injects Node's browser shims used by the Conflux SDK.
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
    buffer: require.resolve('buffer/'),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  );

  // Shared ESM packages still publish extensionless imports.
  config.module.rules.push({
    test: /\.m?js$/,
    include: [/[\\/]node_modules[\\/]/, path.join(common, 'dist') + path.sep],
    resolve: { fullySpecified: false },
  });

  // Resolve linked packages against the app's React and SWR providers.
  config.resolve.alias = {
    ...config.resolve.alias,
    react: path.resolve(__dirname, 'node_modules/react'),
    swr: path.resolve(__dirname, 'node_modules/swr'),
    'react-router-dom': path.resolve(
      __dirname,
      'node_modules/react-router-dom',
    ),
    'react-i18next': path.resolve(__dirname, 'node_modules/react-i18next'),
    'bignumber.js': path.resolve(__dirname, 'node_modules/bignumber.js'),
    destr: path.resolve(__dirname, 'node_modules/destr/dist/index.mjs'),
  };
  config.module.rules.push(
    {
      test: /\.m?js$/,
      include: [
        path.resolve(__dirname, 'node_modules/@cfxjs/use-wallet-react'),
        path.resolve(__dirname, 'node_modules/@cfx-kit/react-utils'),
        path.resolve(__dirname, 'node_modules/@cfx-kit/dapp-utils'),
        path.resolve(__dirname, 'node_modules/viem'),
        path.resolve(__dirname, 'node_modules/cive'),
        /[\\/]node_modules[\\/]ox[\\/]/,
        path.resolve(__dirname, 'node_modules/@msgpack/msgpack'),
        path.resolve(__dirname, 'node_modules/es-toolkit'),
        path.resolve(__dirname, 'node_modules/query-string'),
        path.resolve(__dirname, 'node_modules/filter-obj'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                include: [
                  'transform-numeric-separator',
                  'transform-unicode-sets-regex',
                  'transform-class-properties',
                  'transform-private-methods',
                  'transform-export-namespace-from',
                  'transform-logical-assignment-operators',
                  'transform-nullish-coalescing-operator',
                  'transform-optional-chaining',
                  'transform-private-property-in-object',
                  'transform-class-static-block',
                ],
              },
            ],
          ],
        },
      },
    },
    {
      test: /\.mjs$/,
      include: [path.resolve(__dirname, 'node_modules/destr')],
      type: 'javascript/auto',
    },
  );

  if (mode === 'production') {
    config.resolve.alias['js-conflux-sdk'] = path.resolve(
      __dirname,
      'node_modules/js-conflux-sdk',
    );
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 1,
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
          return configureCssNano(minimizerConfig);
        minimizerConfig.options.parallel = 1;
        return configureCssNano(minimizerConfig);
      }),
    };
  } else {
    config.module.unknownContextCritical = false;
  }
  return smp.wrap(config);
};

module.exports.devServer = createConfig => (proxy, allowedHost) => {
  const {
    https,
    onBeforeSetupMiddleware,
    onAfterSetupMiddleware,
    ...config
  } = createConfig(proxy, allowedHost);
  config.server =
    typeof https === 'object'
      ? { type: 'https', options: https }
      : https
      ? 'https'
      : 'http';
  config.allowedHosts = 'auto';
  delete config.headers; // Use same-origin access for development resources.
  // WDS serializes this callback into the client, so keep it self-contained.
  config.client.overlay.runtimeErrors = error => {
    const frames = (error.stack || '')
      .split('\n')
      .filter(line => /^\s*at\s|@/.test(line));
    const dependencyFrame = /\/static\/js\/dependencies\/[^/\s)]+\.js:\d+(?::\d+)?\)?$/;
    return (
      !frames.length || !frames.every(frame => dependencyFrame.test(frame))
    );
  };
  // Keep the trailing slash CRA strips from the middleware path (GHSA-g84c-rxfj-3j2c).
  config.devMiddleware.publicPath = require('react-scripts/config/paths').publicUrlOrPath;
  config.setupMiddlewares = (middlewares, devServer) => {
    const { Router } = require('express');
    const before = Router();
    const after = Router();
    onBeforeSetupMiddleware({
      app: before,
      // CRA reads `_stats` on each overlay request; WDS 5 updates `stats` on rebuild.
      get _stats() {
        return devServer.stats;
      },
    });
    onAfterSetupMiddleware({ app: after });
    // Let v5 check the request before CRA's source-map and proxy handlers run.
    const index = middlewares.findIndex(
      entry => entry.name === 'webpack-dev-middleware',
    );
    if (index < 0)
      throw new Error('Cannot locate webpack-dev-middleware for CRA setup');
    middlewares.splice(index, 0, { name: 'cra-before', middleware: before });
    middlewares.push({ name: 'cra-after', middleware: after });
    return middlewares;
  };
  return config;
};

// react-app-rewired concatenates package.json Jest arrays with CRA defaults.
// Replace the ignore rule here so the default cannot block these ESM packages.
module.exports.jest = config => ({
  ...config,
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^react$': require.resolve('react'),
    '^swr$': require.resolve('swr'),
    '^swr/immutable$': require.resolve('swr/immutable'),
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(?:query-string|filter-obj|split-on-first|@cfxjs[/\\\\]sirius-next-common)[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
});
