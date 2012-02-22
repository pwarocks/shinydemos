var video_element = document.querySelector('#video');
var thecanvas = document.querySelector('#mycanvas');

var webmvideo = " http:\/\/media.shinydemos.com\/warholiser\/wsh.webm";
var mp4video = " http:\/\/media.shinydemos.com\/warholiser\/wsh.mp4";

var error = 1;
var threshold = 45;
var alpha = 255;

slider.addEventListener('change', changeThreshold, true);
aslider.addEventListener('change', changeAlpha, true);

var options = {audio: false, video:true};

var canvases = document.querySelectorAll('canvas');
for (var i=0; i<canvases.length;i++){
	canvases[i].addEventListener('click', newImg, true);
}



if (navigator.getUserMedia) {
	navigator.getUserMedia(options, v_success, v_error);
} else{
	not_supported();
}



function not_supported() {
	var message = document.querySelector('#message');
	message.innerHTML = "<h1><code>navigator.getUserMedia()</code><br> is not supported by this browser, so this demo will not run properly. Using HTML5 &lt;video&gt; fallback instead.</h1>";
		
		video.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
		video_element.muted= true;
	
	var t=setInterval(copyVideoToCanvas, 100);
}



function v_success(stream) {
	video.src = stream;
	var t=setInterval(copyVideoToCanvas, 100);
}



function v_error(error) {
	console.log("Error! Error code is:"+error.code);
	error = 0;
	
	video.innerHTML = "<source src=\""+webmvideo+"\" type=\"video\/webm\" ><\/source> <source src=\""+mp4video+"\" type=\"video\/mp4\" ><\/source>";
	video_element.muted= true;
	
	var t=setInterval(copyVideoToCanvas, 100);
}



function copyVideoToCanvas() {
	makeImage('red');
	makeImage('green');
	makeImage('yellow');
	makeImage('blue');
}


function newImg() {
	var datauri = this.toDataURL("image/png");
	window.open(datauri);
}



function makeImage(color) {
var thename = "#"+color+"";
var thecanvas = document.querySelector(thename);
var ctx = thecanvas.getContext("2d");
ctx.drawImage(video_element, 0, 0, thecanvas.width, thecanvas.height );
var imgdata = ctx.getImageData(0, 0, thecanvas.width, thecanvas.height);
var pixels = imgdata.data;

// Loop over each pixel and invert the color.
for (var i = 0, n = pixels.length; i < n; i += 4) {
var final = pixels[i] * 0.21 + pixels[i+1] * 0.71 + pixels[i+2] * 0.07 ; 

	if (final > threshold){
		final = 255;
	} else {
		final = 0;
	}
	
pixels[i] = pixels[i+1] = pixels[i+2] = final;
pixels[i+3] = alpha;

switch (color) {
	case 'red': pixels[i] += 255; pixels[i+1] +=0; pixels[i+2] +=0; break;
	case 'green': pixels[i] += 0; pixels[i+1] +=255; pixels[i+2] +=0;  break;
	case 'yellow': pixels[i] += 255; pixels[i+1] +=255; pixels[i+2] +=0; break;
	case 'blue': pixels[i] += 0; pixels[i+1] +=0; pixels[i+2] +=255; break;
}//end switch 

} //end for


// Draw the ImageData at the given (x,y) coordinates.
ctx.putImageData(imgdata, 0, 0);
}
