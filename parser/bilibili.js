function BilibiliParser(xmlDoc, engine) {
  var elements = xmlDoc.getElementsByTagName('d');
  var comments = [];
  for (var i = elements.length - 1; i >= 0; i--) {
    var ele = elements[i];
    if (ele.getAttribute('p') !== null) {
      if (ele.childNodes[0] === undefined) continue;
      var values = ele.getAttribute('p').split(',');
      var comment = {};
      var mode = values[1] * 1;
      if (mode === 6) comment.mode = 'ltr';
      else if (mode === 1) comment.mode = 'rtl';
      else if (mode === 5) comment.mode = 'top';
      else if (mode === 4) comment.mode = 'bottom';
      else continue;
      comment.text = ele.childNodes[0].nodeValue;
      comment.time = values[0] * 1;
      var color = parseInt(values[3]).toString(16);
      while (color.length < 6) color = '0' + color;
      var style = {
        color: '#' + color,
        fontSize: values[2] + 'px',
        textShadow: (color === '000000')
                      ? '-1px -1px #fff, -1px 1px #fff, '
                        + '1px -1px #fff, 1px 1px #fff'
                      : '-1px -1px #000, -1px 1px #000, '
                        + '1px -1px #000, 1px 1px #000'
      };
      var canvasStyle = {
        font: values[2] + 'px sans-serif',
        fillStyle: '#' + color,
        strokeStyle: (color === '000000') ? '#fff' : '#000',
      };
      if (engine === 'DOM') comment.style = style;
      else if (engine === 'canvas') comment.canvasStyle = canvasStyle;
      else {
        comment.style = style;
        comment.canvasStyle = canvasStyle;
      }
      comments.push(comment);
    }
  }
  return comments;
}
