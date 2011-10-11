/*
 * Original code by Sean Christmann: 
 * http://www.craftymind.com/2010/04/20/blowing-up-html5-video-and-mapping-it-into-3d-space/
 * 
 * Edited for use with camera and touch screen by Daniel Davis (Opera Software)
 */

// Global constants
var TILE_WIDTH = 32;
var TILE_HEIGHT = 24;
var TILE_CENTER_WIDTH = TILE_WIDTH / 2;
var TILE_CENTER_HEIGHT = TILE_HEIGHT / 2;
var SOURCERECT = {x:0, y:0, width:0, height:0};
var PAINTX = 0;
var PAINTY = 0;
var PAINTWIDTH = window.innerWidth;
var PAINTHEIGHT = window.innerHeight;
var SUPPORTS_TOUCH = 'createTouch' in document;
var RAD = Math.PI/180;

// Global variables
var video;
var copy;
var copycanvas;
var draw;
var randomJump = false;
var tiles = [];
var debug = false;
var mouse_down = (SUPPORTS_TOUCH ? 'ontouchstart' : 'onmousedown');

function init(){
    video = document.getElementById('sourcevid');
    copycanvas = document.getElementById('sourcecopy');
    copy = copycanvas.getContext('2d');
    
    var outputcanvas = document.getElementById('output');
    draw = outputcanvas.getContext('2d');
    outputcanvas.width = window.innerWidth;
    outputcanvas.height = window.innerHeight;
    outputcanvas[mouse_down] = function() {
        dropBomb(event, this);
    };
    
    // Replace the source of the video element with the stream from the camera
    if (navigator.getUserMedia) {
        navigator.getUserMedia('video', successCallback, errorCallback);
        function successCallback(stream) {
            video.src = stream;
        }
        function errorCallback(error) {
            console.error('An error occurred: [CODE ' + error.code + ']');
            return;
        }
    } else {
        var errorMsg = '<p class="error">Uh oh, it appears your browser doesn\'t support this feature.<br>Please try with a <a href="http://my.opera.com/core/blog/2011/03/23/webcam-orientation-preview">browser that has camera support</a>.';
        document.querySelector('[role=main]').innerHTML = errorMsg;
        console.log('Native web camera streaming (getUserMedia) is not supported in this browser.');
        return;
    }
    
    setInterval("processFrame()", 33);
}

function createTiles(){
    var offsetX = (TILE_CENTER_WIDTH+(PAINTWIDTH-SOURCERECT.width)/2 >> 0);
    var offsetY = (TILE_CENTER_HEIGHT+(PAINTHEIGHT-SOURCERECT.height)/2 >> 0);
    var y=0;
    while(y < SOURCERECT.height){
        var x=0;
        while(x < SOURCERECT.width){
            var tile = new Tile();
            tile.videoX = x;
            tile.videoY = y;
            tile.originX = offsetX+x;
            tile.originY = offsetY+y;
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
            tiles.push(tile);
            x+=TILE_WIDTH;
        }
        y+=TILE_HEIGHT;
    }
}

function processFrame(){
    if(!isNaN(video.duration)){
        if(SOURCERECT.width == 0){
            SOURCERECT = {x:0,y:0,width:video.videoWidth,height:video.videoHeight};
            copycanvas.width = video.videoWidth;
            copycanvas.height = video.videoHeight;
            
            TILE_WIDTH = copycanvas.width / 16;
            TILE_HEIGHT = copycanvas.height / 16;
            TILE_CENTER_WIDTH = TILE_WIDTH / 2 >> 0;
            TILE_CENTER_HEIGHT = TILE_HEIGHT / 2 >> 0;
            
            createTiles();
        }
    }
    var debugStr = "";
    //copy tiles
    copy.drawImage(video, 0, 0);
    draw.clearRect(PAINTX, PAINTY,PAINTWIDTH,PAINTHEIGHT);
    
    for(var i=0, len = tiles.length; i<len; i++){
        var tile = tiles[i];
        if(tile.force > 0.0001){
            //expand
            var force = tile.force;
            tile.moveX *= force;
            tile.moveY *= force;
            tile.moveRotation *= force;
            tile.currentX += tile.moveX;
            tile.currentY += tile.moveY;
            tile.rotation += tile.moveRotation;
            tile.rotation %= 360;
            tile.force *= 0.9;
            if(tile.currentX <= 0 || tile.currentX >= PAINTWIDTH){
                tile.moveX *= -1;
            }
            if(tile.currentY <= 0 || tile.currentY >= PAINTHEIGHT){
                tile.moveY *= -1;
            }
        }else if(tile.rotation != 0 || tile.currentX != tile.originX || tile.currentY != tile.originY){
            //contract
            var diffx = (tile.originX-tile.currentX)*0.2;
            var diffy = (tile.originY-tile.currentY)*0.2;
            var diffRot = (0-tile.rotation)*0.2;
            
            if(absolute(diffx) < 0.5){
                tile.currentX = tile.originX;
            }else{
                tile.currentX += diffx;
            }
            if(absolute(diffy) < 0.5){
                tile.currentY = tile.originY;
            }else{
                tile.currentY += diffy;
            }
            if(absolute(diffRot) < 0.5){
                tile.rotation = 0;
            }else{
                tile.rotation += diffRot;
            }
        }else{
            tile.force = 0;
        }
        draw.save();
        draw.translate(tile.currentX, tile.currentY);
        draw.rotate(tile.rotation*RAD);
        draw.drawImage(copycanvas, tile.videoX, tile.videoY, TILE_WIDTH, TILE_HEIGHT, -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        draw.restore();
    }
    if(debug){
        debug = false;
        document.getElementById('trace').innerHTML = debugStr;
    }
}

function explode(x, y){
    for(var i=0, len = tiles.length; i<len; i++){
        var tile = tiles[i];
        
        var xdiff = tile.currentX-x;
        var ydiff = tile.currentY-y;
        var dist = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
        var rnd = Math.random();
        
        var randRange = 180+(rnd*10);
        var range = randRange-dist;
        var force = 3*(range/randRange);
        if(force > tile.force){
            tile.force = force;
            var radians = Math.atan2(ydiff, xdiff);
            tile.moveX = Math.cos(radians);
            tile.moveY = Math.sin(radians);
            tile.moveRotation = 0.5-rnd;
        }
    }
    tiles.sort(zindexSort);
    processFrame();
}

function zindexSort(a, b){
    return (a.force-b.force);
}

function dropBomb(evt, obj){
    evt.preventDefault();
    var posx = 0;
    var posy = 0;
    var e = evt || window.event;
    
    if (evt.touches) {
        posx = event.touches[0].pageX;
        posy = event.touches[0].pageY;
    }else if (e.pageX || e.pageY){
        posx = e.pageX;
        posy = e.pageY;
    }else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var canvasX = posx-obj.offsetLeft;
    var canvasY = posy-obj.offsetTop;
    explode(canvasX, canvasY);
}

// Constructor for individual tiles
function Tile(){
    this.originX = 0;
    this.originY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.force = 0;
    this.z = 0;
    this.moveX= 0;
    this.moveY= 0;
    this.moveRotation = 0;
    this.videoX = 0;
    this.videoY = 0;
}

/*
    getPixel
    return pixel object {r,g,b,a}
*/
function getPixel(imageData, x, y){
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    return {r:data[pos], g:data[pos+1], b:data[pos+2], a:data[pos+3]}
}
/*
    setPixel
    set pixel object {r,g,b,a}
*/
function setPixel(imageData, x, y, pixel){
    var data = imageData.data;
    var pos = (x + y * imageData.width) * 4;
    data[pos] = pixel.r;
    data[pos+1] = pixel.g;
    data[pos+2] = pixel.b;
    data[pos+3] = pixel.a;
}
/*
    copyPixel
    faster then using getPixel/setPixel combo
*/
function copyPixel(sImageData, sx, sy, dImageData, dx, dy){
    var spos = (sx + sy * sImageData.width) * 4;
    var dpos = (dx + dy * dImageData.width) * 4;
    dImageData.data[dpos] = sImageData.data[spos];     //R
    dImageData.data[dpos+1] = sImageData.data[spos+1]; //G
    dImageData.data[dpos+2] = sImageData.data[spos+2]; //B
    dImageData.data[dpos+3] = sImageData.data[spos+3]; //A
}

// Slightly faster than Math.abs
function absolute(x) {
    return (x < 0 ? -x : x);
}

window.onload = init;
