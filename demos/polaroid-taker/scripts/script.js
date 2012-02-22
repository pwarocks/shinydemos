var picbutton = document.querySelector('#picbutton');
var resetbutton = document.querySelector('#resetbutton');
var video_element = document.querySelector('video');
var overlay = document.querySelector('#overlay');

picbutton.addEventListener('click', snapshot, false);
video_element.addEventListener('click', snapshot, false);
video_element.addEventListener('ended', loopVideo, false);
resetbutton.addEventListener('click', clearImages, false);
window.addEventListener('devicemotion', shakeReset, false);
overlay.addEventListener('click', closeOverlay, false);

var prev = 0;
var options = {audio: false, video:true};
var webmvideo = "http:\/\/media.shinydemos.com\/warholiser\/wsh.webm";
var mp4video = "http:\/\/media.shinydemos.com\/warholiser\/wsh.mp4";

if (navigator.getUserMedia){
  	navigator.getUserMedia(options, v_success, v_error);
}

else if (navigator.webkitGetUserMedia) {
	navigator.webkitGetUserMedia("video", webkit_v_success, v_error)
}

else {
	not_supported();
}

function not_supported(){
	var message = document.querySelector('#message');
	message.innerHTML = "<h2>Webcam access through the WebRTC spec is not supported by this browser. Moving to a <code>&lt;video&gt;</code> fallback instead.</h2>";
	video_element.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
	video_element.muted = true;
}

function v_success(stream){
	video_element.src = stream;
}

function webkit_v_success(stream) {
	video_element.src = window.webkitURL.createObjectURL(stream)
}

function v_error(error){
	console.log("Error! Error code is:"+error.code);
}

function makePhotoBorder(w,h){
   var close, photoborder, polaroid, polaroidKid, canvas;

   polaroid = document.querySelector('#pictures');
   polaroidKid = polaroid.firstChild;

   if( polaroidKid !== null ){
      photoborder = polaroidKid.cloneNode(true);
   } else {
       photoborder = document.createElement('section');

       canvas = document.createElement('canvas');
       canvas.width = w;
	   canvas.height = h;

       close = document.createElement('button');
       close.innerHTML = 'Close';
       close.addEventListener('click',closeOverlay,false);

       photoborder.appendChild(canvas);
       photoborder.appendChild(close);
   }

   photoborder.id = 'leadPhoto';
   photoborder.className = "pic";
   photoborder.style.width  = w+'px';
   photoborder.style.height = h+'px';

   return photoborder;
}

function snapshot(){
    var photoborder, canvas, ctx, cw, ch;

    /*
    Removing the invisible class now so that we can
    fade in the overlay later.
    */
    overlay.className = overlay.className.replace(/invisible/gi,'');

	w = video_element.clientWidth * 1.2;
	h = video_element.clientHeight * 1.2;

    photoborder = makePhotoBorder(w,h);
    canvas = photoborder.querySelector('canvas');

    ctx = canvas.getContext('2d');
	cw = canvas.width;
	ch = canvas.height;
	ctx.drawImage(video_element, 0, 0, cw, ch );

    overlay.appendChild(photoborder);

    // Play the camera shutter noise.
    document.querySelector('audio').play();

	showOverlay();
}

function shakeReset(event){

	if (event.acceleration){
	var acc_x = Math.abs(event.acceleration.x);
	var acc_y = Math.abs(event.acceleration.y);
	var acc_z = Math.abs(event.acceleration.z);
	}

	if ( (acc_x || acc_y || acc_z) > 15.5){
		clearImages();
	}
}

function clearImages(){
	var canvases = document.querySelectorAll('section');
	var polaroid = document.querySelector('#pictures');
	for (var i=0; i<canvases.length; i++){
		polaroid.removeChild(canvases[i]);
	}
}


function getDeg(){
	if (prev == 0){
		var number = Math.floor(Math.random()*45);
		prev += 1;
		return number;
	} else {
		var number = Math.floor(Math.random()*45);
		number *= -1;
		prev -= 1;
		return number;
	}
}

function closeOverlay(){
    var leadPhoto, polaroid;
    var transition = transitionEvent();
    var ol = overlay;

    ol.className = 'hide';

    leadPhoto = document.querySelector('#leadPhoto');

    if( leadPhoto !== null ){
        polaroid = document.querySelector('#pictures');

        /*
          If we don't have a first child, append the photo.
          Otherwise, insert it at the beginning of the stack.
        */
        if( polaroid.firstChild === null ){
           polaroid.appendChild(leadPhoto);
        } else {
           polaroid.insertBefore(leadPhoto, polaroid.firstChild);
        }

        leadPhoto.style.cssText = '';
        leadPhoto.id = '';
    }

    /*
       When the opacity transition ends, add the invisible class
       to hide the overlay
    */
    ol.addEventListener(transition, function(evt){
        if( evt.target.className.indexOf('hide') > -1 ){
            evt.target.className += ' invisible';
        }
    }, false);

    // Restart the video
    video_element.play();
}

function showOverlay(){
    var ol = overlay;
    var transition = transitionEvent();

    ol.className = ol.className.replace(/hide/gi,'');

    ol.addEventListener(transition, function(){
        var leadPhoto =  document.querySelector('#leadPhoto');
        if( leadPhoto ){
            leadPhoto.className += ' slidein';
        }
    }, false);
}

function transitionEvent(){
    var t, transitions, el = document.createElement('fakeel');

    transitions = {
        'transition':'transitionEnd',
        'OTransition':'oTransitionEnd',
        'msTransition':'MSTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
     }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function loopVideo(event){
    event.currentTarget.play();
}
