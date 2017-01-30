import {
  containerFontSize,
  rootFontSize,
  computeFontSize
} from '../../src/util/fontSize.js';

/* istanbul ignore next */
describe('font size', function() {
  it('should compute containerFontSize by container node', function() {
    var $container = document.createElement('div');
    document.body.appendChild($container);
    $container.style.fontSize = '20px';
    computeFontSize($container);
    assert.equal(20, containerFontSize);

    $container.style.fontSize = '16px';
    computeFontSize($container);
    document.body.removeChild($container);
  });

  it('should compute rootFontSize by <HTML>', function() {
    var $html = document.getElementsByTagName('html')[0];
    $html.style.fontSize = '20px';
    computeFontSize($html);
    assert.equal(20, rootFontSize);

    $html.style.fontSize = '16px';
    computeFontSize($html);
  });
});
