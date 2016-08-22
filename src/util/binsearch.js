export default function(a, k, t) {
  var m = 0;
  var l = 0;
  var r = a.length;
  while (l < r) {
    m = (l + r) >> 1;
    if (t <= a[m][k]) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return Math.max(0, r);
}
