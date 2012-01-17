var video_element = document.querySelector('#video');
var resetButton = document.querySelector("#reset");
var cPallete = document.querySelector("#doit");


video_element.addEventListener('click', takeimage, true);
cPallete.addEventListener('click', takeimage, true);
resetButton.addEventListener('click', reset, true);

var options = {
	"audio": false,
	"video": true
};

if (navigator.getUserMedia){
	navigator.getUserMedia(options, v_success);
} else{
	not_supported();
}

function not_supported(){
	var vid_c = document.querySelector("#video_container");
	vid_c.innerHTML = "It seems this browser does not support <code>navigator.getUserMedia()<\/code>, please use a browser which does in order to see this demo in action.";
	resetButton.className = "hide";
	cPallete.className = "hide";
}

function v_success(stream){
	video_element.src = stream;
}

function v_error(error){
	console.log("Error! Error code is:"+error.code);
}

function takeimage(){
var canvas = document.querySelector('#mycanvas');
var ctx = canvas.getContext('2d');
var cw = canvas.width;
var ch = canvas.height;
var pixelCount = cw*ch;
ctx.drawImage(video_element, 0, 0, cw, ch);
var pixels = ctx.getImageData(0, 0, cw, ch).data;
otherColors(pixels, pixelCount);
}

function dominantColor(pixels, pixelCount) {
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
	var cmap = MMCQ.quantize(pixelArray, 5);
	var newPalette = cmap.palette();
	
	var colorArray = {"r": newPalette[0][0], "g": newPalette[0][1], "b": newPalette[0][2]};
	var primarySqaure = document.querySelector("#primesquare");
	primarySqaure.setAttribute('style', "background-color:rgb("+colorArray.r+", "+colorArray.g+", "+colorArray.b+");");

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

