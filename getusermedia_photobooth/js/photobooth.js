var video = document.querySelector('video'),
    btn = document.getElementById('cam'),
    ctn = document.getElementById('pics'),
    snapshots = document.getElementById('photos'),
    photos = snapshots.getContext('2d'),
    tb = document.getElementById('toolbar'),
    img = new Image(),
    audio = new Audio('assets/click.ogg'),
    VIDEO_WIDTH = video.width = window.innerWidth - 140,
    VIDEO_HEIGHT = video.height = window.innerHeight,
    FRAME_HEIGHT = Math.floor(VIDEO_HEIGHT * 0.85),
    FRAME_WIDTH = FRAME_HEIGHT * (87/112),
    FRAME_X = (VIDEO_WIDTH - FRAME_WIDTH) / 2,
    FRAME_Y = (VIDEO_HEIGHT - FRAME_HEIGHT) / 2,
    VIDEO_INTRINSIC_WIDTH,
    VIDEO_INTRINSIC_HEIGHT,
    FRAME_INTRINSIC_HEIGHT,
    FRAME_INTRINSIC_WIDTH,
    FRAME_INTRINSIC_X,
    FRAME_INTRINSIC_Y,
    frame = document.body.appendChild(document.createElement('div')),
    snaps = [
      function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 8, 87, 112);},
      function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 132, 87, 112);},
      function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 257, 87, 112);},
      function(){photos.drawImage(video, FRAME_INTRINSIC_X, FRAME_INTRINSIC_Y, FRAME_INTRINSIC_WIDTH, FRAME_INTRINSIC_HEIGHT, 5, 381, 87, 112);}
    ];
    
var takeSnap = function(){
  var i = 0,
      id = setInterval(function(){
        if (snaps.length){
          snaps.shift()();
          click();
        }
         
        if (++i == 4){
          clearInterval(id);
          slideDown();
        }
      }, 1200);
};

var fallback = function(){
  video.src = 'video.webm';
  video.onloadedmetadata = function(){
    video.muted = true;
    VIDEO_INTRINSIC_WIDTH = video.videoWidth;
    VIDEO_INTRINSIC_HEIGHT = video.videoHeight;
    FRAME_INTRINSIC_HEIGHT = Math.floor(VIDEO_INTRINSIC_HEIGHT * 0.85);
    FRAME_INTRINSIC_WIDTH = FRAME_INTRINSIC_HEIGHT * (87/112);
    FRAME_INTRINSIC_X = (VIDEO_INTRINSIC_WIDTH - FRAME_INTRINSIC_WIDTH) / 2;
    FRAME_INTRINSIC_Y = (VIDEO_INTRINSIC_HEIGHT - FRAME_INTRINSIC_HEIGHT) / 2;
    takeSnap();
  };
};

var drawFrame = (function(){
  frame.id = "frame";
  frame.style = "width:"+FRAME_WIDTH+"px;height:"+FRAME_HEIGHT+"px;top:"+FRAME_Y+"px;left:"+FRAME_X+"px;";
}());

var canvasPrep = (function(){
  photos.fillStyle = '#333';
  photos.fillRect(0,0,98,498);
  img.src = 'phototemplate.png';
  img.onload = function(){
    photos.drawImage(this, 0, 0);
  };
}());

var click = function(){
  audio.play();
};

var slideDown = function(){
  snapshots.classList.remove('blank');
  snapshots.classList.add('done');
};

var init = (function(){  
  navigator.getUserMedia ? 
    navigator.getUserMedia('video', function(stream){
      video.src = stream;
      video.onloadedmetadata = takeSnap;  
    }, fallback) : fallback();
})();