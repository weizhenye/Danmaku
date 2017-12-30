import createCommentNode from '../../src/util/commentNode.js';

describe('comment node', function() {
  it('should create a <div> node by style', function() {
    var comment = {text: 'Fly Me To The Moon'};
    var node = createCommentNode(comment);
    assert.equal('DIV', node.tagName);
    assert.equal(comment.text, node.textContent);
    assert.equal('absolute', node.style.position);

    comment.style = {fontSize: '20px'};
    node = createCommentNode(comment);
    assert.equal(comment.style.fontSize, node.style.fontSize);
  });

  it('should create a <div> node by render', function() {
    var $span = document.createElement('span');
    $span.textContent = '秋深し　隣はなにも　しない人';
    var comment = {
      render: function() {
        return $span;
      }
    };
    var node = createCommentNode(comment);
    assert.equal('DIV', node.tagName);
    assert.equal($span, node.childNodes[0]);
  });

  it('should ignore render function when not HTMLElement returned', function() {
    var comment = {
      text: '秋深し　情けは人の　ためならず',
      render: function() {
        return {};
      }
    };
    var node = createCommentNode(comment);
    assert.equal('DIV', node.tagName);
    assert.equal(comment.text, node.textContent);
  });

  it('shoud be able to support HTML', function() {
    var comment = {text: '<span>Fly Me To The Moon</span>', html: true};
    var node = createCommentNode(comment);
    assert.equal('SPAN', node.lastChild.tagName);
    assert.equal('Fly Me To The Moon', node.lastChild.textContent);
  });
});
