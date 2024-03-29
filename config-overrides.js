const { ProvidePlugin } = require('webpack');

module.exports = function (config, env) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.(m?js|ts)$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          resolve: {
            fullySpecified: false
          }
        }
      ]
    },
    plugins: [
      ...config.plugins,
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new ProvidePlugin({
        process: 'process/browser'
      })
    ],
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify')
      }
    },
    ignoreWarnings: [/Failed to parse source map/]
  };
};
