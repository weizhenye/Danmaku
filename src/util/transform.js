export default function(x, y) {
  var vendors = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
  var translateStr = 'transform:translate(' + x + 'px,' + y + 'px);';
  var transformStr = '';
  for (var i = vendors.length - 1; i >= 0; i--) {
    transformStr += vendors[i] + translateStr;
  }
  return transformStr;
}
