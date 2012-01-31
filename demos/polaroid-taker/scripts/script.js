var picbutton = document.querySelector('#picbutton');
var resetbutton = document.querySelector('#resetbutton');
var video_element = document.querySelector('video');
var overlay = document.querySelector('#overlay');
var audio = document.querySelector('audio');

picbutton.addEventListener('click', snapshot, false);
video_element.addEventListener('click', snapshot, false);
resetbutton.addEventListener('click', clearImages, false);
window.addEventListener('devicemotion', shakeReset, false);
overlay.addEventListener('click', closeOverlay, false);

var prev= 0;
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
    showOverlay();
    audio.play();

    var photoborder = document.createElement('section');
    var close = document.createElement('button');
	var canvas = document.createElement('canvas');
	var w = video_element.clientWidth * 1.2;
	var h = video_element.clientHeight * 1.2;

    close.innerHTML = 'Close';

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

	applyEvents();
}


function applyEvents(){
	var elems = document.querySelectorAll('.pic');
	for (var i=0; i<elems.length;i++){
		elems[i].addEventListener('click', newimg, true);
	}
}


function newimg(){
	var datauri = this.toDataURL("image/png");
	window.open(datauri);
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

function closeOverlay(event){
    event.target.className = 'hide';

    var leadPhoto, polaroid;
    leadPhoto = document.querySelector('#leadPhoto');

    if( leadPhoto !== null ){
        polaroid = document.querySelector('#pictures');
        polaroid.insertBefore(leadPhoto, polaroid.firstChild);
        leadPhoto.style = '';
        leadPhoto.id = '';
    }

    event.target.addEventListener('oTransitionEnd', function(){
        if( this.classList.contains('hide') == true ){
            this.classList.add('invisible');
        }
    }, false);
}

function showOverlay(){
    var ol = overlay;
    ol.className = ol.className.replace(/hide|invisible/gi,'');

    overlay.addEventListener('oTransitionEnd', function(){
        var leadPhoto =  document.querySelector('#leadPhoto');

        if( leadPhoto ){
            leadPhoto.className += ' slidein';
        }
    }, false);
}

