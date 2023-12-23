const webpack = require('webpack');

module.exports = function override(config, env) {
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  );

  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    https: require.resolve('https-browserify'),
    fs: false,
    querystring: require.resolve('querystring-es3'),
    url: require.resolve('url'),
    net: require.resolve('net'),
    http: require.resolve('stream-http'),
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    zlib: require.resolve('browserify-zlib'),
    tls: false,
    buffer: require.resolve("buffer"),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
    }),
  ];

  return config;
};
