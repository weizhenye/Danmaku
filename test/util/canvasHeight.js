import canvasHeight from '../../src/util/canvasHeight.js';
import {containerFontSize, rootFontSize} from '../../src/util/fontSize.js';

describe('canvas height', function() {
  var ch = canvasHeight;
  var LH = 1.2;

  it('should default line-height as 1.2', function() {
    assert.equal(12, ch('10px sans-serif'));
  });

  it('should cache result', function() {
    assert.equal(12, ch('10px sans-serif'));
  });

  it('should support font-size units', function() {
    assert.equal(rootFontSize * LH, ch('1rem sans-serif'));
    assert.equal(containerFontSize * LH, ch('1em sans-serif'));
    assert.equal(containerFontSize * LH, ch('100% sans-serif'));
    assert.equal(16 * LH, ch('16px sans-serif'));
  });

  it('should support line-height units', function() {
    assert.equal(16, ch('16px/1 sans-serif'));
    assert.equal(16, ch('16px/1em sans-serif'));
    assert.equal(rootFontSize, ch('16px/1rem sans-serif'));
    assert.equal(16, ch('16px/100% sans-serif'));
    assert.equal(16, ch('16px/16px sans-serif'));
  });

  it('should ignore spaces between font-size and line-height', function() {
    assert.equal(16, ch('16px/ 1 sans-serif'));
    assert.equal(16, ch('16px /1 sans-serif'));
    assert.equal(16, ch('16px / 1 sans-serif'));
  });

  it('should ignore unsupported string', function() {
    assert.equal(12, ch('16 sans-serif'));
    assert.equal(12, ch('0px sans-serif'));
    assert.equal(12, ch('large sans-serif'));
  });
});
