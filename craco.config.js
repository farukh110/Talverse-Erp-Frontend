const { when, whenDev, whenProd, whenCI, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#d45390',
          '@secondary-color': '#89439e',
          '@light-color': '#d9d9d9',
          '@link-color': '#501D5F',
          '@success-color': '#3bc499',
          '@box-shadow': '0px 2px 8px 0px #d4d4d4',
          '@warning-color': '#faad14',
          '@error-color': '#ff656d',
          '@font-size-base': '14px',
          '@heading-color': 'rgba(0, 0, 0, 0.85)',
          '@text-color': 'rgba(0, 0, 0, 0.65)',
          '@text-color-secondary': 'rgba(0, 0, 0, 0.45)',
          '@disabled-color': 'rgba(0, 0, 0, 0.25)',
          '@border-radius-base': '2px',
          '@border-color-base': '#d9d9d9',
          '@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
        },
      },
    },
  ],
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      if (!webpackConfig.plugins) {
        config.plugins = [];
      }

      webpackConfig.plugins.push(
        process.env.NODE_ENV === 'production'
          ? new CopyWebpackPlugin([
            {
              from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
            },
            {
              from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
            },
            {
              from: 'src/lib/abp.js',
            },
          ])
          : new CopyWebpackPlugin([
            {
              from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
            },
            {
              from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
              to: 'dist/abp.signalr-client.js'
            },
            {
              from: 'src/lib/abp.js',
            },
          ])
      );

      return webpackConfig;
    },
  },
};
