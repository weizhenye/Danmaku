import createCommentNode from '../../src/util/commentNode.js';

/* istanbul ignore next */
describe('comment node', function() {
  it('should create a <div> node with style', function() {
    const comment = {text: 'Fly Me To The Moon'};
    let node = createCommentNode(comment);
    assert.equal('DIV', node.tagName);
    assert.equal(comment.text, node.textContent);
    assert.equal('absolute', node.style.position);
    assert.equal('nowrap', node.style.whiteSpace);

    comment.style = {fontSize: '20px'};
    node = createCommentNode(comment);
    assert.equal(comment.style.fontSize, node.style.fontSize);
  });
});
