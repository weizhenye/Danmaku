function collidableRange() {
  var max = 9007199254740991;
  return [{
    range: 0,
    time: -max,
    width: max,
    height: 0
  }, {
    range: max,
    time: max,
    width: 0,
    height: 0
  }];
}

/* eslint no-invalid-this: 0 */
export default function() {
  this._ltr = collidableRange();
  this._rtl = collidableRange();
  this._top = collidableRange();
  this._bottom = collidableRange();
}
