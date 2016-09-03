module.exports = function(config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha'],
    browsers: ['Chrome'],
    files: [
      'node_modules/chai/chai.js',
      'test/test.js'
    ],
    preprocessors: {
      'test/test.js': ['rollup', 'coverage']
    },
    rollupPreprocessor: {
      format: 'iife',
      globals: {
        chai: 'chai'
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      subdir: '.'
    }
  });
};
