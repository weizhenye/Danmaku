import canvasHeight from '../../src/util/canvasHeight.js';

describe('canvas height', function() {
  var ch = canvasHeight;
  var LH = 1.2;
  var _ = {
    root: 16,
    container: 16
  };

  it('should default line-height as 1.2', function() {
    assert.equal(12, ch('10px sans-serif', _));
  });

  it('should cache result', function() {
    assert.equal(12, ch('10px sans-serif', _));
  });

  it('should support font-size units', function() {
    assert.equal(_.root * LH, ch('1rem sans-serif', _));
    assert.equal(_.container * LH, ch('1em sans-serif', _));
    assert.equal(_.container * LH, ch('100% sans-serif', _));
    assert.equal(16 * LH, ch('16px sans-serif'));
  });

  it('should support line-height units', function() {
    assert.equal(16, ch('16px/1 sans-serif', _));
    assert.equal(16, ch('16px/1em sans-serif', _));
    assert.equal(_.root, ch('16px/1rem sans-serif', _));
    assert.equal(16, ch('16px/100% sans-serif', _));
    assert.equal(16, ch('16px/16px sans-serif', _));
  });

  it('should ignore spaces between font-size and line-height', function() {
    assert.equal(16, ch('16px/ 1 sans-serif', _));
    assert.equal(16, ch('16px /1 sans-serif', _));
    assert.equal(16, ch('16px / 1 sans-serif', _));
  });

  it('should ignore unsupported string', function() {
    assert.equal(12, ch('16 sans-serif', _));
    assert.equal(12, ch('0px sans-serif', _));
    assert.equal(12, ch('large sans-serif', _));
  });

  it('should support vaild CSS font syntax', function() {
    assert.equal(16 * LH, ch('italic 16px serif', _));
    assert.equal(32, ch('italic small-caps bold 16px/2 cursive', _));
    assert.equal(24, ch('small-caps 700 24px/1 sans-serif', _));
  });
});
