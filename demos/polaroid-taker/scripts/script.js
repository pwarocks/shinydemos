var picbutton = document.querySelector('#picbutton');
var resetbutton = document.querySelector('#resetbutton');
var video_element = document.querySelector('video');
var overlay = document.querySelector('#overlay');

picbutton.addEventListener('click', snapshot, false);
video_element.addEventListener('click', snapshot, false);
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
	message.innerHTML = "<h2>Webcam access through the WebRTC spec is not supported by this browser. Moving to a &lt;video&gt; fallback instead.</h2>";

	video_element.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
	video_element.muted= true;

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


function snapshot(){
    /*
    Removing the invisible class now so that we can
    fade in the overlay later.
    */
    overlay.className = overlay.className.replace(/invisible/gi,'');

    var photoborder = document.createElement('section');
    var close = document.createElement('button');
	var canvas = document.createElement('canvas');
	var w = video_element.clientWidth * 1.2;
	var h = video_element.clientHeight * 1.2;

    close.innerHTML = 'Close';
    close.addEventListener('click',closePhoto,false);

    photoborder.id = 'leadPhoto';
    photoborder.className = "pic";

    photoborder.style.width  = w+'px';
    photoborder.style.height = h+'px';

	canvas.width = w;
	canvas.height = h;

    photoborder.appendChild(canvas);
    photoborder.appendChild(close);
    overlay.appendChild(photoborder);

	var ctx = canvas.getContext('2d');
	var cw = canvas.width;
	var ch = canvas.height;
	ctx.drawImage(video_element, 0, 0, cw, ch );

	showOverlay();

    // Play the camera shutter noise.
    document.querySelector('audio').play();

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
    event.target.className = 'hide';

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
    overlay.addEventListener(transition, function(evt){
        if( evt.target.className.indexOf('hide') > -1 ){
            evt.target.className += ' invisible';
        }
    }, false);

}

function showOverlay(){
    var ol = overlay;
    var transition = transitionEvent();

    ol.className = ol.className.replace(/hide/gi,'');

    overlay.addEventListener(transition, function(){
        var leadPhoto =  document.querySelector('#leadPhoto');
        if( leadPhoto ){
            leadPhoto.className += ' slidein';
        }
    }, false);
}

function closePhoto(clickEvent){
    console.log( clickEvent.currentTarget.parentNode );
    closeOverlay();

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

