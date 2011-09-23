(function(win, doc){
  var video = doc.querySelector('video'),
      snapshots = doc.getElementById('pics'),
      photos = snapshots.getContext('2d'),
      img = new Image(),
      audio = new Audio('media/click.ogg'),
      button = doc.querySelector('button'),
      VIDEO_WIDTH, VIDEO_HEIGHT,
      snaps = [
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 6, 150, 112.5);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 124, 150, 112.5);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 242, 150, 112.5);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 361, 150, 112.5);}
      ];
      
  var canvasPrep = (function(){
    photos.fillStyle = '#fff';
    photos.lineCap = 'square';
    photos.fillRect(0,0,160,480);
    photos.lineWidth = 2;
    photos.strokeStyle = '#515151';
    photos.strokeRect(0,0,160,480)
    photos.lineWidth = 1;
    photos.fillStyle = '#ccc';
    photos.fillRect(5, 6, 150, 112);
    photos.fillRect(5, 124, 150, 112);
    photos.fillRect(5, 242, 150, 112);
    photos.fillRect(5, 361, 150, 112);
  }());

  var computeAspect = function(){
    //compute correct size/aspect ratio for picture frame
    //browsers that don't have object fit will look wacky
    VIDEO_WIDTH = video.videoWidth;
    VIDEO_HEIGHT = video.videoHeight;
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
      }
    }, interval);
  };

  var fallback = function(){
    video.onloadedmetadata = function(){
      //not all browsers have video@muted yet.
      this.muted = true;
      computeAspect();
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
  
  var init = (function(){
    
    navigator.getUserMedia ? 
      navigator.getUserMedia('video', function(stream){
        video.src = stream;
        video.onloadedmetadata = function(){
          computeAspect();
        }; 
      }, fallback) : fallback();
  }());
  
  button.onclick = function(){
    console.log('hi');
    takeSnaps(1200);
  };
}(window, document));