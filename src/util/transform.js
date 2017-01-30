export var transform = (function() {
  var properties = [
    'oTransform', // Opera 11.5
    'msTransform', // IE 9
    'mozTransform',
    'webkitTransform',
    'transform'
  ];
  var style = document.createElement('div').style;
  for (var i = 0; i < properties.length; i++) {
    /* istanbul ignore else */
    if (properties[i] in style) {
      return properties[i];
    }
  }
  /* istanbul ignore next */
  return 'transform';
}());
