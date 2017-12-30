export /* istanbul ignore next */ var raf =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function(cb) {
    return setTimeout(cb, 50 / 3);
  };

export /* istanbul ignore next */ var caf =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  clearTimeout;
