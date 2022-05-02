import { canvasHeight, canvasHeightCache, createCommentCanvas } from '../../src/engine/canvas.js';

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
    assert.equal(12, canvasHeightCache['10px sans-serif']);
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

describe('comment canvas', function() {
  var fontSize = {
    root: 16,
    container: 16
  };

  it('should create a <canvas> by style', function() {
    var comment = {
      text: '戦場ヶ原、蕩れ',
      style: {
        font: '20px sans-serif',
        strokeStyle: '#a97aba'
      }
    };
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal('CANVAS', canvas.tagName);
    assert.equal(comment.width * (window.devicePixelRatio || 1), canvas.width);
    assert.equal(comment.height * (window.devicePixelRatio || 1), canvas.height);
    assert.equal(comment.style.font, ctx.font.trim());
    assert.equal(comment.style.strokeStyle, ctx.strokeStyle);
  });

  it('should create a <canvas> by render', function() {
    var comment = {
      render: function() {
        var canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, 2 * Math.PI);
        ctx.stroke();
        return canvas;
      }
    };
    var canvas = createCommentCanvas(comment, fontSize);
    assert.equal('CANVAS', canvas.tagName);
    assert.equal(320, comment.width);
    assert.equal(180, comment.height);
  });

  it('should ignore render function when not <canvas> returned', function() {
    var comment = {
      text: '君と出会わなければ　つらくないのに',
      style: {
        font: '20px sans-serif',
      },
      render: function() {
        return document.createElement('div');
      }
    };
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal(comment.style.font, ctx.font.trim());
  });

  it('should support to set textBaseline', function() {
    var comment = { text: 'ドキドキ' };
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal('bottom', ctx.textBaseline);

    comment = { text: '', style: { textBaseline: 'top' } };
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.style.textBaseline, ctx.textBaseline);

    comment = { text: '', style: { textBaseline: 'middle' } };
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.style.textBaseline, ctx.textBaseline);

    comment = { text: '', style: { textBaseline: 'alphabetic' } };
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.style.textBaseline, ctx.textBaseline);
  });

  it('should use cached size value', function() {
    var comment = {
      text: 'ワクワク',
      width: 128,
      height: 32
    };
    var canvas = createCommentCanvas(comment, fontSize);
    assert.equal(comment.width * (window.devicePixelRatio || 1), canvas.width);
    assert.equal(comment.height * (window.devicePixelRatio || 1), canvas.height);
  });

  it('should deal with lineWidth', function() {
    var canvas1 = createCommentCanvas({
      text: '忍',
      style: {
        lineWidth: Infinity
      }
    });
    var canvas2 = createCommentCanvas({
      text: '忍',
      style: {
        strokeStyle: '#fd879d',
        lineWidth: 8
      }
    });
    assert.equal(canvas2.width, canvas1.width + 16 * (window.devicePixelRatio || 1));
    assert.equal(canvas2.height, canvas1.height + 16 * (window.devicePixelRatio || 1));
  });
});
