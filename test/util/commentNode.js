import createCommentNode from '../../src/util/commentNode.js';

describe('comment node', function() {
  it('should create a <div> node with style', function() {
    var comment = {text: 'Fly Me To The Moon'};
    var node = createCommentNode(comment);
    assert.equal('DIV', node.tagName);
    assert.equal(comment.text, node.textContent);
    assert.equal('absolute', node.style.position);

    comment.style = {fontSize: '20px'};
    node = createCommentNode(comment);
    assert.equal(comment.style.fontSize, node.style.fontSize);
  });

  it('shoud be able to support HTML', function() {
    var comment = {text: '<span>Fly Me To The Moon</span>', html: true};
    var node = createCommentNode(comment);
    assert.equal('SPAN', node.lastChild.tagName);
    assert.equal('Fly Me To The Moon', node.lastChild.textContent);
  });
});
