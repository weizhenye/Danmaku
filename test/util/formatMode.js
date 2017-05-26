import formatMode from '../../src/util/formatMode.js';

describe('format mode', function() {
  var fm = formatMode;

  it('should return top, bottom, ltr, rtl as is', function() {
    assert.equal('top', fm('top'));
    assert.equal('bottom', fm('bottom'));
    assert.equal('ltr', fm('ltr'));
    assert.equal('rtl', fm('rtl'));
  });

  it('should return lower-case mode', function() {
    assert.equal('rtl', fm('RTL'));
  });

  it('should set unknown mode to rtl', function() {
    assert.equal('rtl', fm('unknown'));
  });
});
