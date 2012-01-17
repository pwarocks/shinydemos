/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

function initFrames(){
  var curr = new BorderBox({width: 150, height: 150, framed: true}),
      prev = new BorderBox({width: 150, height: 150, framed: true}),
      next = new BorderBox({width: 150, height: 150, framed: true}),
      prevfar = new BorderBox({width: 150, height: 150, framed: true}),
      nextfar = new BorderBox({width: 150, height: 150, framed: true});
      
  curr.frame.classList.add('current');
  prev.frame.classList.add('prev');
  next.frame.classList.add('next');
  prevfar.frame.classList.add('prev-far');
  nextfar.frame.classList.add('next-far');
  
  [prevfar, prev, curr, next, nextfar].forEach(function(el){
    el.create();
  });
}

function prevSlide(){
  var frame = document.querySelector('.prev');
  makeSlide({dir: 'prev'});
  frame.classList.add('current');
  frame.classList.remove('prev');
  frame.previousSibling.classList.remove('prev-far');
  frame.previousSibling.classList.add('prev');
  frame.nextSibling.classList.remove('current');
  frame.nextSibling.classList.add('next');
  frame.nextSibling.nextSibling.classList.remove('next');
  frame.nextSibling.nextSibling.classList.add('next-far');
  setTimeout(function(){frame.parentNode.removeChild(frame.nextSibling.nextSibling);}, 300);
}

function nextSlide(){
  var frame = document.querySelector('.next');
  makeSlide({dir: 'next'});
  frame.classList.add('current');
  frame.classList.remove('next');
  frame.nextSibling.classList.remove('next-far');
  frame.nextSibling.classList.add('next');
  frame.previousSibling.classList.remove('current');
  frame.previousSibling.classList.add('prev');
  frame.previousSibling.previousSibling.classList.remove('prev');
  frame.previousSibling.previousSibling.classList.add('prev-far');
  setTimeout(function(){frame.parentNode.removeChild(frame.previousSibling.previousSibling);}, 300);
}

function makeSlide(slide){
  var newSlide;
  if (slide.dir == 'next'){
    newSlide = new BorderBox({width: 150, height: 150, framed: true});
    newSlide.create();
    newSlide.frame.classList.add('next-far');
  } else if (slide.dir == 'prev') {
    newSlide = new BorderBox({width: 150, height: 150, framed: true});
    newSlide.frame.classList.add('prev-far');
    newSlide.create();
    document.body.insertBefore(newSlide.frame, frameList[0]);
  }
}

function makeCurrent(el){
  var frame = el.frame ? el.frame : el;
  
  if (frame.classList.contains('current')) return;
  
  if (frame.classList.contains('prev')){
    prevSlide();
  }
  
  if (frame.classList.contains('next')){
    nextSlide();
  }
}

//modified from http://html5slides.googlecode.com/svn/trunk/slides.js

function handleBodyKeyDown(event) {
  switch (event.keyCode) {
    case 39: // right arrow
    case 13: // Enter
    case 32: // space
    case 34: // PgDn
      nextSlide();
      event.preventDefault();
      break;

    case 37: // left arrow
    case 8: // Backspace
    case 33: // PgUp
      prevSlide();
      event.preventDefault();
      break;
  }
};

/* Touch events */

function handleTouchStart(event) {
  if (event.touches.length == 1) {
    touchDX = 0;
    touchDY = 0;

    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;

    document.body.addEventListener('touchmove', handleTouchMove, true);
    document.body.addEventListener('touchend', handleTouchEnd, true);
  }
};

function handleTouchMove(event) {
  if (event.touches.length > 1) {
    cancelTouch();
  } else {
    touchDX = event.touches[0].pageX - touchStartX;
    touchDY = event.touches[0].pageY - touchStartY;
  }
};

function handleTouchEnd(event) {
  var dx = Math.abs(touchDX);
  var dy = Math.abs(touchDY);

  if ((dx > PM_TOUCH_SENSITIVITY) && (dy < (dx * 2 / 3))) {
    if (touchDX > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }

  cancelTouch();
};

function cancelTouch() {
  document.body.removeEventListener('touchmove', handleTouchMove, true);
  document.body.removeEventListener('touchend', handleTouchEnd, true);  
};

function eventListeners(){
  frameList = document.getElementsByClassName('frame'),
  paintings = document.querySelectorAll('.frame > div');
  [].slice.apply(frameList).forEach(function(){
      addEventListener('click', function(event){makeCurrent(event.target);}, false);
  });
  
  [].slice.apply(paintings).forEach(function(){
      addEventListener('click', function(event){makeCurrent(event.target.parentNode);}, false);
  });
  
  
  document.addEventListener('keydown', handleBodyKeyDown, false);
  document.body.addEventListener('touchstart', handleTouchStart, false);
  
}

function showHints(){
  var lhint = document.createElement('div'),
      rhint = lhint.cloneNode(false);
      
  lhint.innerHTML = '&larr;';
  rhint.innerHTML = '&rarr;';
  rhint.className = 'right-hint';
  lhint.className = 'left-hint';
  
  document.body.appendChild(rhint);
  document.body.appendChild(lhint);
  
  setTimeout(hideHints, 1000);
  
  function hideHints(){
    rhint.classList.add('fade');
    lhint.classList.add('fade');
    setTimeout(function(){
      lhint.parentNode.removeChild(lhint);
      rhint.parentNode.removeChild(rhint);
    }, 500); 
  }
}

function init(){
  var PM_TOUCH_SENSITIVITY = 15;
  
  ['frame1', 'frame2'].forEach(function(item){
    new Image().src = item;
  });
  initFrames();
  eventListeners();
  showHints();
};

document.addEventListener('DOMContentLoaded', init, false);
