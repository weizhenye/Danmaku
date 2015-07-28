function BilibiliParser(xmlDoc) {
  var elements = xmlDoc.getElementsByTagName('d');
  var comments = [];
  for (var i = elements.length - 1; i >= 0; i--) {
    var ele = elements[i];
    if (ele.getAttribute('p') !== null) {
      if (ele.childNodes[0] === undefined) continue;
      var values = ele.getAttribute('p').split(',');
      var comment = {};
      var mode = values[1] * 1;
      if (mode === 6) comment.mode = 'lefttoright';
      else if (mode === 1) comment.mode = 'righttoleft';
      else if (mode === 5) comment.mode = 'top';
      else if (mode === 4) comment.mode = 'bottom';
      else continue;
      comment.text = ele.childNodes[0].nodeValue;
      comment.time = values[0] * 1;
      var color = parseInt(values[3]).toString(16);
      while (color.length < 6) color = '0' + color;
      comment.style = {
        color: '#' + color,
        fontSize: values[2] + 'px',
        textShadow: (color === '000000')
                      ? '-1px -1px #fff, -1px 1px #fff, '
                        + '1px -1px #fff, 1px 1px #fff'
                      : '-1px -1px #000, -1px 1px #000, '
                        + '1px -1px #000, 1px 1px #000'
      };
      comments.push(comment);
    }
  }
  return comments;
}
