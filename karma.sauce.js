const replace = require('@rollup/plugin-replace');
const istanbul = require('rollup-plugin-istanbul');

// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
const customLaunchers = {
  'SL-iOS-Safari-Latest': {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    platformVersion: '13.0',
    platformName: 'iOS',
  },
  'SL-iOS-Safari-Oldest': {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    platformVersion: '10.3',
    platformName: 'iOS',
  },
  'SL-Android-Latest': {
    base: 'SauceLabs',
    deviceName: 'Android Emulator',
    browserName: 'Chrome',
    platformVersion: '8.0',
    platformName: 'Android',
  },
  'SL-Android-Oldest': {
    base: 'SauceLabs',
    deviceName: 'Android Emulator',
    browserName: 'Browser',
    platformVersion: '5.1',
    platformName: 'Android',
  },
  'SL-Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome',
  },
  'SL-Firefox': {
    base: 'SauceLabs',
    browserName: 'firefox',
  },
  'SL-Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
  },
  'SL-Edge': {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
  },
  'SL-IE-11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  'SL-IE-10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10',
  },
  'SL-IE-9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9',
  },
};

module.exports = function(config) {
  config.set({
    singleRun: true,
    concurrency: 5,
    captureTimeout: 300000,
    browserNoActivityTimeout: 120000,
    frameworks: ['mocha', 'chai'],
    browsers: Object.keys(customLaunchers),
    customLaunchers,
    files: [
      'node_modules/es6-promise/dist/es6-promise.auto.min.js',
      'test/test.js'
    ],
    preprocessors: {
      'test/test.js': ['rollup']
    },
    rollupPreprocessor: {
      output: {
        format: 'iife',
      },
      plugins: [
        replace({ 'process.env.ENGINE': '""' }),
        istanbul({ exclude: ['test/**/*.js'] })
      ]
    },
    reporters: ['dots', 'saucelabs'],
    sauceLabs: {
      testName: 'Danmaku test',
      recordScreenshots: false
    },
  });
};
