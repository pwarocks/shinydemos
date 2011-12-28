//Safari doesn't have Funtion#bind yet :(
if(!Function.prototype.bind){Function.prototype.bind=function(oThis){if(typeof this!=="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");}
var fSlice=Array.prototype.slice,aArgs=fSlice.call(arguments,1),fToBind=this,fNOP=function(){},fBound=function(){return fToBind.apply(this instanceof fNOP?this:oThis||window,aArgs.concat(fSlice.call(arguments)));};fNOP.prototype=this.prototype;fBound.prototype=new fNOP();return fBound;};}

var BorderBox = function(config){
  this.dirs = ['Top', 'Right', 'Bottom', 'Left'];
  this.corners = ['BottomLeft', 'BottomRight', 'TopLeft', 'TopRight'];
  this.box = document.createElement('div');
  this.width = config.width;
  this.height = config.height;
  if (this.framed = config.framed) {
    this.frame = document.createElement('div');
    this.frame.className = 'frame';
  }
};

BorderBox.prototype = {
  style: function(){
    var styles = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'];
    return styles[this.random(9)];
  },
  
  random: function(limit){
    return Math.floor(Math.random() * limit);
  },
  
  color: function(){
    return '#' + Math.random().toString(16).slice(-6);
  },
  
  number: function(){
    var upperLimit = (this.width + this.height) / 2;
    return this.random(upperLimit) + "px";
  },
  
  doubleNumber: function(){
    var upperLimit = (this.width + this.height) / 2,
        first = this.random(upperLimit) + "px",
        second = this.random(upperLimit) + "px";
    return first + " " + second;
  },
  
  oneOrTwo: function(){
    return [this.number.bind(this), this.doubleNumber.bind(this)][+(Math.random() > 0.5)]();
  },
  
  border: function(prop, style){
    this.box.style['border' + prop] = style;
  },
  
  create: function(){
    var frameBorder = this.random(60),
        frameStyle = ['frame-style-1', 'frame-style-2'][+(Math.random() > 0.5)];
    this.box.style.width = this.width + "px";
    this.box.style.height = this.height + "px";
    this.box.style.backgroundColor = this.color();
    this.dirs.forEach(function(item){
      this.border(item + 'Width', this.number());
      this.border(item + 'Style', this.style());
      this.border(item + 'Color', this.color());
    }, this);
    this.corners.forEach(function(item){
      this.border(item + 'Radius', this.oneOrTwo());
    }, this);
    if (this.framed){
      this.frame.style.borderWidth = (frameBorder > 10 ? frameBorder : 10) + "px";
      this.frame.classList.add(frameStyle);
    }
    this.append();
  },
  
  append: function(){
    if (this.framed){
      document.body.appendChild(this.frame);
      this.frame.appendChild(this.box);
    } else {
      document.body.appendChild(this.box);
    }
  },
  
  destroy: function(){
    document.body.removeChild(this.box);
    this.box = null;
  }
};