var video_element = document.querySelector('#video');
var resetButton = document.querySelector("#reset");
var cPallete = document.querySelector("#doit");

var webmvideo = "http:\/\/media.shinydemos.com\/warholiser\/wsh.webm";
var mp4video = "http:\/\/media.shinydemos.com\/warholiser\/wsh.mp4";

video_element.addEventListener('click', takeimage, true);
cPallete.addEventListener('click', takeimage, true);
resetButton.addEventListener('click', reset, true);

var options = {
	"audio": false,
	"video": true
};

var notsupported = false;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

if (navigator.getUserMedia){
	navigator.getUserMedia(options, v_success);
} else {
	not_supported();
}

function not_supported(){
	var vid_c = document.querySelector("#video_container");
	vid_c.innerHTML = "<video id='video' autoplay loop='loop'><source src='" + webmvideo + 
		" type='video\/webm\'></source> <source src='" + mp4video + "' type='video\/mp4'></source></video>";
	notSupported = true;
}

function v_success(stream){
	video_element.src = window.URL.createObjectURL( stream ) || stream;
}

function v_error(error){
	console.log("Error! Error code is:"+error.code);
}

function takeimage(){
	var vid = document.querySelector("#video");
	var canvas = document.querySelector('#mycanvas');
	var ctx = canvas.getContext('2d');
	var cw;
	var ch;
	
	if (notSupported === true){
		cw = vid.offsetWidth;
		ch = vid.offsetHeight;
	} else {
		cw = canvas.width;
		ch = canvas.height;
	}
	
	var pixelCount = cw*ch;
	ctx.drawImage(vid, 0, 0, cw, ch);
	var pixels = ctx.getImageData(0, 0, cw, ch).data;
	otherColors(pixels, pixelCount);
}


function otherColors(pixels, pixelCount) {
	var pixelArray = [];
	for (var i = 0; i < pixelCount; i++) {  
		// If pixel is mostly opaque and not white
		if(pixels[i*4+3] >= 125){
			if(!(pixels[i*4] > 250 && pixels[i*4+1] > 250 && pixels[i*4+2] > 250)){
				pixelArray.push( [pixels[i*4], pixels[i*4+1], pixels[i*4+2]]);
			}
		}
	}
	// Send array to quantize function which clusters values
	// using median cut algorithm
	var cmap = MMCQ.quantize(pixelArray, 16);
	var newPalette = cmap.palette();
	var colors = document.querySelector("#colors");
	var colorlist = document.querySelector("#colorlist");
	
	for (var i=0; i<=newPalette.length; i++){
		var theli = document.createElement('li');
		var thediv = document.createElement('div');
		thediv.className = 'othercolors';
		thediv.setAttribute('style', "background-color:rgba("+newPalette[i][0]+","+newPalette[i][1]+","+newPalette[i][2]+", 1.0) !important;");
		
		
		theli.appendChild(thediv);
		theli.innerHTML += " rgb("+newPalette[i][0]+","+newPalette[i][1]+","+newPalette[i][2]+")";
		colorlist.appendChild(theli);
		
	}

}


function reset() {
	var colorlist = document.querySelector("#colorlist");
	colorlist.innerHTML = "";
}

