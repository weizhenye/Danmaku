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

export function resetSpace(space) {
  space.ltr = collidableRange();
  space.rtl = collidableRange();
  space.top = collidableRange();
  space.bottom = collidableRange();
}
