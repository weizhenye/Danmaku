export /* istanbul ignore next */ var raf =
  (
    typeof window !== 'undefined' &&
    (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame
    )
  ) ||
  function(cb) {
    return setTimeout(cb, 50 / 3);
  };

export /* istanbul ignore next */ var caf =
  (
    typeof window !== 'undefined' &&
    (
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame
    )
  ) ||
  clearTimeout;

export function binsearch(arr, prop, key) {
  var mid = 0;
  var left = 0;
  var right = arr.length;
  while (left < right - 1) {
    mid = (left + right) >> 1;
    if (key >= arr[mid][prop]) {
      left = mid;
    } else {
      right = mid;
    }
  }
  if (arr[left] && key < arr[left][prop]) {
    return left;
  }
  return right;
}


export function formatMode(mode) {
  if (!/^(ltr|top|bottom)$/i.test(mode)) {
    return 'rtl';
  }
  return mode.toLowerCase();
}

function collidableRange() {
  var max = 9007199254740991;
  return [
    { range: 0, time: -max, width: max, height: 0 },
    { range: max, time: max, width: 0, height: 0 }
  ];
}

export function resetSpace(space) {
  space.ltr = collidableRange();
  space.rtl = collidableRange();
  space.top = collidableRange();
  space.bottom = collidableRange();
}
