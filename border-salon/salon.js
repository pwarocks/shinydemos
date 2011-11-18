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

function eventListeners(){
  frameList = document.getElementsByClassName('frame');
  [].slice.apply(frameList).forEach(function(){
      addEventListener('click', function(event){makeCurrent(event.target);}, false);
  });
  
  document.addEventListener('keydown', handleBodyKeyDown, false);  
}

function init(){
  initFrames();
  eventListeners();
};

document.addEventListener('DOMContentLoaded', init, false);