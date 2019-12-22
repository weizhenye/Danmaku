const replace = require('@rollup/plugin-replace');
const istanbul = require('rollup-plugin-istanbul');

module.exports = function(config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    browsers: ['ChromeHeadless'],
    files: [
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
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      subdir: '.'
    }
  });
};
