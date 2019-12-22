import { binsearch, formatMode } from '../src/utils.js';

describe('binsearch', function() {
  it('should find correct position for given value', function() {
    var arr = [
      { time: 1 },
      { time: 3 },
      { time: 5 },
      { time: 7 }
    ];
    assert.equal(0, binsearch(arr, 'time', 0));
    assert.equal(1, binsearch(arr, 'time', 1));
    assert.equal(1, binsearch(arr, 'time', 2));
    assert.equal(2, binsearch(arr, 'time', 3));
    assert.equal(2, binsearch(arr, 'time', 4));
    assert.equal(3, binsearch(arr, 'time', 5));
    assert.equal(3, binsearch(arr, 'time', 6));
    assert.equal(4, binsearch(arr, 'time', 7));
    assert.equal(4, binsearch(arr, 'time', 8));
  });
});

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
