import binsearch from '../../src/util/binsearch.js';

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
