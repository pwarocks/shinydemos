var video = document.getElementById('video'),
    webmvideo = "http:\/\/shinydemos.com\/media\/warholiser\/wsh.webm",
    mp4video = "http:\/\/shinydemos.com\/media\/warholiser\/wsh.mp4",
    options = {audio: false, video:true},
    red = document.getElementById('red'),
    green = document.getElementById('green'),
    blue = document.getElementById('blue'),
    yellow = document.getElementById('yellow'),
    canvasWidth = red.width,
    canvasHeight = red.height,
    redCtx = red.getContext('2d'),
    greenCtx = green.getContext('2d'),
    yellowCtx = yellow.getContext('2d'),
    blueCtx = blue.getContext('2d');

  //"inlining" what used to be a for loop
  red.addEventListener('click', newImg);
  green.addEventListener('click', newImg);
  blue.addEventListener('click', newImg);
  yellow.addEventListener('click', newImg);
  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

if (navigator.getUserMedia){
  navigator.getUserMedia(options, v_success, v_error);
} else {
  not_supported();
}

function not_supported() {
  video.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
  video.muted= true;        
  setInterval(copyVideoToCanvas, 100);
}

function v_success(stream) {
  if (video.mozCaptureStream) { // Needed to check for Firefox
    video.mozSrcObject = stream;
  } else {
    video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
  }
  video.play();
  setInterval(copyVideoToCanvas, 100);
}

function v_error(error) {
  console.log("Error! Error code is:"+error.code);
  video.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
  video.muted= true;

  setInterval(copyVideoToCanvas, 100);
}


function copyVideoToCanvas() {
  makeImage(red, redCtx);
  makeImage(green, greenCtx);
  makeImage(yellow, yellowCtx);
  makeImage(blue, blueCtx);
}

function newImg() {
  var datauri = this.toDataURL("image/png");
  window.open(datauri);
}

function makeImage(canvas, ctx) {
  var imgdata, pixels, final;
  ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
  imgdata = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  pixels = imgdata.data;

  // Loop over each pixel and invert the color.
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    final = pixels[i] * 0.21 + pixels[i+1] * 0.71 + pixels[i+2] * 0.07 ; 

    if (final > 50){
      final = 255;
    } else {
      final = 0;
    }
        
    pixels[i] = pixels[i+1] = pixels[i+2] = final;
    pixels[i+3] = 255;

    switch (canvas.id) {
      case 'red': pixels[i] += 255; break;
      case 'green': pixels[i+1] +=255; break;
      case 'yellow': pixels[i] += 255; pixels[i+1] +=255; break;
      case 'blue': pixels[i+2] +=255; break;
    }

  }

  // Draw the ImageData at the given (x,y) coordinates.
  ctx.putImageData(imgdata, 0, 0);
}
