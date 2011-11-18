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

function prevSlide(frame){
  makeSlide({dir: 'prev'});
  frame.classList.remove('prev');
  frame.previousSibling.classList.remove('prev-far');
  frame.previousSibling.classList.add('prev');
  frame.nextSibling.classList.remove('current');
  frame.nextSibling.classList.add('next');
  frame.nextSibling.nextSibling.classList.remove('next');
  frame.nextSibling.nextSibling.classList.add('next-far');
}

function nextSlide(frame){
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
    document.body.insertBefore(newSlide.frame, frames[0]);
  }
}

function makeCurrent(el){
  var frame = el.frame ? el.frame : el;
  
  if (el.classList.contains('current')) return;
  
  frame.classList.add('current');
  
  if (frame.classList.contains('prev')){
    prevSlide(frame);
  }
  
  if (frame.classList.contains('next')){
    nextSlide(frame);
    makeSlide({dir: 'next'});
  }
  
  //addNextFrame();
  
  //nextSibling add next class in chain, if that guy doesn't
  //have a sibling, create it
  //prev sibling moves down in chain
  
  //need a notion of direction so i can flip that behavior
}

function bindClicks(){
  frames = document.getElementsByClassName('frame');
  [].slice.apply(frames).forEach(function(){
      addEventListener('click', function(event){makeCurrent(event.target);}, false);
  });
}

function init(){
  initFrames();
  bindClicks();
};

document.addEventListener('DOMContentLoaded', init, false);