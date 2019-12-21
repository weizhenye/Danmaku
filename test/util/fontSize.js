import { computeFontSize } from '../../src/util/fontSize.js';

describe('font size', function() {
  var fontSize = {
    root: 16,
    container: 16
  };

  it('should compute container font size by container node', function() {
    var $container = document.createElement('div');
    document.body.appendChild($container);
    $container.style.fontSize = '20px';
    computeFontSize($container, fontSize);
    assert.equal(20, fontSize.container);

    $container.style.fontSize = '16px';
    computeFontSize($container, fontSize);
    document.body.removeChild($container);
  });

  it('should compute root font size by <HTML>', function() {
    var $html = document.getElementsByTagName('html')[0];
    $html.style.fontSize = '20px';
    computeFontSize($html, fontSize);
    assert.equal(20, fontSize.root);

    $html.style.fontSize = '16px';
    computeFontSize($html, fontSize);
  });
});
