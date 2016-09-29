import createCommentCanvas from '../../src/util/commentCanvas.js';

/* istanbul ignore next */
describe('comment canvas', function() {
  it('should create a <canvas> with canvasStyle', function() {
    const comment = {
      text: '戦場ヶ原、蕩れ',
      canvasStyle: {
        font: '20px sans-serif',
        strokeStyle: '#a97aba'
      }
    };
    const canvas = createCommentCanvas(comment);
    const ctx = canvas.getContext('2d');
    assert.equal('CANVAS', canvas.tagName);
    assert.equal(comment.width, canvas.width);
    assert.equal(comment.height, canvas.height);
    assert.equal(comment.canvasStyle.font, ctx.font);
    assert.equal(comment.canvasStyle.strokeStyle, ctx.strokeStyle);
  });

  it('should support to set textBaseline', function() {
    let comment = {text: 'ドキドキ'};
    let canvas = createCommentCanvas(comment);
    let ctx = canvas.getContext('2d');
    assert.equal('bottom', ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'top'}};
    canvas = createCommentCanvas(comment);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'middle'}};
    canvas = createCommentCanvas(comment);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);

    comment = {text: '', canvasStyle: {textBaseline: 'alphabetic'}};
    canvas = createCommentCanvas(comment);
    ctx = canvas.getContext('2d');
    assert.equal(comment.canvasStyle.textBaseline, ctx.textBaseline);
  });

  it('should use cached size value', function() {
    const comment = {
      text: 'ワクワク',
      width: 128,
      height: 32
    };
    const canvas = createCommentCanvas(comment);
    assert.equal(comment.width, canvas.width);
    assert.equal(comment.height, canvas.height);
  });
});
