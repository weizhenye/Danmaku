module.exports = function(config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    files: [
      'test/test.js'
    ],
    preprocessors: {
      'test/test.js': ['rollup', 'coverage']
    },
    rollupPreprocessor: {
      format: 'iife'
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      subdir: '.'
    }
  });
};
