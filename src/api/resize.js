/* eslint-disable no-invalid-this */
export default function() {
  if(this.engine == "canvas"){
    this._.stage.width = this.container.offsetWidth * devicePixelRatio;
    this._.stage.height = this.container.offsetHeight * devicePixelRatio;
    this._.stage.style.width = this.container.offsetWidth + 'px';
    this._.stage.style.height = this.container.offsetHeight + 'px';
  }else{
    this._.stage.width = this.container.offsetWidth;
    this._.stage.height = this.container.offsetHeight;
  }
  this._.engine.resize(this._.stage);
  this._.duration = this._.stage.width / this._.speed;
  return this;
}
