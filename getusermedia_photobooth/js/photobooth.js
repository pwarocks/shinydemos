(function(win, doc){
  var video = doc.querySelector('video'),
      snapshots = doc.getElementById('photos'),
      photos = snapshots.getContext('2d'),
      leftArrow = doc.getElementById('leftarrow'),
      rightArrow = doc.getElementById('rightarrow'),
      img = new Image(),
      audio = new Audio('media/click.ogg'),
      lb = doc.createElement('div'),
      frame = doc.body.appendChild(doc.createElement('div')),
      splash = doc.getElementById('splash'),
      button = splash.querySelector('button'),
      /* lolcaps */
      VIDEO_WIDTH, VIDEO_HEIGHT,
      FRAME_WIDTH, FRAME_HEIGHT,
      FRAME_X, FRAME_Y,
      VIDEO_INTRINSIC_WIDTH, VIDEO_INTRINSIC_HEIGHT,
      FRAME_INTRINSIC_HEIGHT, FRAME_INTRINSIC_WIDTH,
      FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y,
      snaps = [
        function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 8, 87, 112);},
        function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 132, 87, 112);},
        function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 257, 87, 112);},
        function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 381, 87, 112);}
      ];
      
  var canvasPrep = (function(){
    photos.fillStyle = '#333';
    photos.fillRect(0,0,98,498);
    img.src = 'phototemplate.png';
    img.onload = function(){
      photos.drawImage(this, 0, 0);
    };
  }());

  var computeBounds = function(callback){
    VIDEO_WIDTH = video.width = win.innerWidth;
    VIDEO_HEIGHT = video.height = win.innerHeight;
    FRAME_HEIGHT = Math.floor(VIDEO_HEIGHT * 0.85);
    FRAME_WIDTH = FRAME_HEIGHT * (87/112);
    FRAME_X = ((VIDEO_WIDTH - FRAME_WIDTH) / 2) - 10;
    FRAME_Y = (VIDEO_HEIGHT - FRAME_HEIGHT) / 2;
    
    if (arguments.length && typeof callback == "function"){
      callback();
    }
  };

  var computeAspect = function(){
    //compute correct size/aspect ratio for picture frame
    VIDEO_INTRINSIC_WIDTH = video.videoWidth;
    VIDEO_INTRINSIC_HEIGHT = video.videoHeight;
    FRAME_INTRINSIC_HEIGHT = Math.floor(VIDEO_INTRINSIC_HEIGHT * 0.85);
    FRAME_INTRINSIC_WIDTH = FRAME_INTRINSIC_HEIGHT * (87/112);
    FRAME_INTRINSIC_X = (VIDEO_INTRINSIC_WIDTH - FRAME_INTRINSIC_WIDTH) / 2;
    FRAME_INTRINSIC_Y = (VIDEO_INTRINSIC_HEIGHT - FRAME_INTRINSIC_HEIGHT) / 2;
  };
  
  var getSplashX = function(){
    return FRAME_X - ((520 - FRAME_WIDTH)/2);
  };
  
  var getSplashY = function(){
    return FRAME_Y + ((FRAME_HEIGHT - 364)/2);
  };
  
  var drawFrame = function(callback){
    computeBounds();
    splash.style.left = getSplashX()+ "px";
    splash.style.top = getSplashY()+ "px";
    leftArrow.style.left = FRAME_X - 154 +"px";
    rightArrow.style.left = FRAME_WIDTH + FRAME_X + 25 + "px";
    frame.id = "frame";
    frame.style.width = FRAME_WIDTH + "px";
    frame.style.height = FRAME_HEIGHT + "px";
    frame.style.top = FRAME_Y + "px";
    frame.style.left = FRAME_X + "px";
    frame.classList.add('hidden')
  
  };

  var takeSnaps = function(interval){
    var i = 0,
    id = setInterval(function(){
      if (snaps.length){
        snaps.shift()();
        audio.play();
      }
    
      if (++i == 4){
        clearInterval(id);
        slideDown();
      }
    }, interval);
  };

  var fallback = function(){
    video.addEventListener('loadedmetadata',function(){
      this.play();
      this.muted = true;
      computeAspect();
    }, false);
  };

  var slideDown = function(){
    snapshots.classList.remove('blank');
    snapshots.classList.add('done');
    snapshots.onclick = function(){
      //do this because super long data URIs cause opera to screech to a halt
      sessionStorage.setItem('snap', this.toDataURL());
      location.href='snap.html';
    };
  };

  //http://goo.gl/zTZY0 thx @unscriptable
  var debounce = function(func, threshold, execAsap) {
    var timeout;
    return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
        if (!execAsap) func.apply(obj, args);
        timeout = null; 
      };
      if (timeout) clearTimeout(timeout);
      else if (execAsap) func.apply(obj, args);
      timeout = setTimeout(delayed, threshold || 100); 
    };
  };
  
  var removeSplash = function(){
    [splash, frame, leftArrow, rightArrow].forEach(function(elm){
      elm.classList.toggle('hidden');
    });
  };

  var init = (function(){
    drawFrame();
    
    navigator.getUserMedia ? 
      navigator.getUserMedia('video', function(stream){
        video.src = stream;
        video.addEventListener('loadedmetadata', function(){
          computeAspect();
          this.play();
        }, false);
      }, fallback) : fallback();
  }());
  
  button.onclick = function(){
    removeSplash();
    takeSnaps(1200);
  };

  win.onresize = debounce(function(){
    drawFrame();
    computeAspect();
  }, 100, false);

  win.addEventListener('OTransitionEnd', function(){
    lb.id = "lb";
    doc.body.appendChild(lb);
    frame.style.borderColor = 'rgba(255,255,255,.05)';
    video.pause();
  }, false);
}(window, document));