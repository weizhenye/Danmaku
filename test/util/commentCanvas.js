import createCommentCanvas from '../../src/util/commentCanvas.js';

describe('comment canvas', function() {
  var fontSize = {
    root: 16,
    container: 16
  };

  it('should create a <canvas> by canvasStyle', function() {
    var comment = {
      text: '戦場ヶ原、蕩れ',
      canvasStyle: {
        font: '20px sans-serif',
        strokeStyle: '#a97aba'
      }
    };
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal('CANVAS', canvas.tagName);
    assert.equal(comment.width, canvas.width);
    assert.equal(comment.height, canvas.height);
    assert.equal(comment.canvasStyle.font, ctx.font);
    assert.equal(comment.canvasStyle.strokeStyle, ctx.strokeStyle);
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
      canvasStyle: {
        font: '20px sans-serif',
      },
      render: function() {
        return document.createElement('div');
      }
    };
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.font, ctx.font);
  });

  it('should support to set textBaseline', function() {
    var comment = {text: 'ドキドキ'};
    var canvas = createCommentCanvas(comment, fontSize);
    var ctx = canvas.getContext('2d');
    assert.equal('bottom', ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'top'}};
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'middle'}};
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'alphabetic'}};
    canvas = createCommentCanvas(comment, fontSize);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);
  });

  it('should use cached size value', function() {
    var comment = {
      text: 'ワクワク',
      width: 128,
      height: 32
    };
    var canvas = createCommentCanvas(comment, fontSize);
    assert.equal(comment.width, canvas.width);
    assert.equal(comment.height, canvas.height);
  });

  it('should deal with lineWidth', function() {
    var canvas1 = createCommentCanvas({
      text: '忍',
      canvasStyle: {
        lineWidth: Infinity
      }
    });
    var canvas2 = createCommentCanvas({
      text: '忍',
      canvasStyle: {
        strokeStyle: '#fd879d',
        lineWidth: 8
      }
    });
    assert.equal(canvas2.width, canvas1.width + 16);
    assert.equal(canvas2.height, canvas1.height + 16);
  });
});
