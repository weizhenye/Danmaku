export /* istanbul ignore next */ var raf = (function() {
  if (typeof window !== 'undefined') {
    var rAF = (
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame
    );
    if (rAF) return rAF.bind(window);
  }
  return function(cb) {
    return setTimeout(cb, 50 / 3);
  };
})();

export /* istanbul ignore next */ var caf = (function() {
  if (typeof window !== 'undefined') {
    var cAF = (
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame
    );
    if (cAF) return cAF.bind(window);
  }
  return clearTimeout;
})();

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

export function now() {
  return typeof window.performance !== 'undefined' && window.performance.now
    ? window.performance.now()
    : Date.now();
}
