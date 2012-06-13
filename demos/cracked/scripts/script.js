/*
 * Created by Daniel Davis (Opera Software)
 * 
 * Uses concepts developed by Sean Christmann: 
 * http://www.craftymind.com/2010/04/20/blowing-up-html5-video-and-mapping-it-into-3d-space/
 */

 
/* COMMON FUNCTIONS */
// Get random number between a range
// Code from: http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal === 'undefined' ? randVal >> 0 : randVal.toFixed(floatVal);
}

// Returns an array containing the x and y coordinates of an event (e.g. mouse click)
// Code from: http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
function getCoords(event) {
    var x, y;
    if (event.touches) {
        x = event.touches[0].pageX;
        y = event.touches[0].pageY;
    } else if (event.pageX || event.pageY) { 
        x = event.pageX;
        y = event.pageY;
        
    } else { 
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    }
    x -= canvas1.offsetLeft;
    y -= canvas1.offsetTop;
    return [x, y];
}

/* MAIN SCRIPT */
document.addEventListener('DOMContentLoaded', function(){
    // Global variables
    var windowwidth = window.outerWidth;
    var windowheight = window.outerHeight;
    var shards = [];
    var coords = [];
    var MAX_ROTATION = 0.05; // In radians
    var DRAW_SPEED = 1000 / 20; // Draw at 20 fps
    var mouse_down = ('createTouch' in document ? 'ontouchstart' : 'onmousedown');
    var video = document.querySelector('video');;
    var canvas1 = document.getElementById('canvas1');
    var context1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    var HEALING_DELAY = 600; // Milliseconds
    var HEALING_TIME = 1000; // Milliseconds
    var opacity = 1;
    var timer_delay = HEALING_DELAY;
    var timer_heal = HEALING_TIME;
    var heal_step = DRAW_SPEED / HEALING_TIME;
 
    // Shard constructor
    function Shard() {
        this.rotation = 0;
        this.corner1 = []; // Make this an empty array
        this.corner2 = [];
        this.corner3 = [];
    }
    
    // Create coordinates and rotation value for each shard
    function createShards(coords) {
        var y = 0;
        var x = 0;
        var shard_total = 100; // Just in case, limit loop to 100
        var shard_num = 0;
        var all_sides = false;
        var step;
        var shard;
        shards = [];
        
        do {
            shard = new Shard();
            shard.corner1 = coords;            
            step = randomXToY(100, 300);
            
            if (x <= windowwidth && y <= 0) {
                // Move right
                shard.corner2 = [x, y];
                x += step;
                shard.corner3 = [x, y];
            } else if (x >= windowwidth && y <= windowheight) {
                // Move down
                shard.corner2 = [x, y];
                y += step;
                shard.corner3 = [x, y];
                // Make sure we've gone round the entire window
                if (all_sides) {
                    break;
                }
            } else if (x >= 0 && y >= windowheight) {
                // Move left
                shard.corner2 = [x, y];
                x -= step;
                shard.corner3 = [x, y];
            } else if (x <= 0 && y >= 0) {
                // Move up
                shard.corner2 = [x, y];
                y -= step;
                shard.corner3 = [x, y];
                all_sides = true;
            }
            
            shard.rotation = randomXToY(MAX_ROTATION * -1, MAX_ROTATION, 3);
            shard.rotation_step = shard.rotation * heal_step;
            shards.push(shard);
            
            shard_num++;
        } while (shard_num < shard_total);        
    }
    
    // Draw images on both canvases
    function doDraw(video, ctx1, ctx2, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (video.paused || video.ended) return false;
        
        // Draw video onto first canvas
        ctx1.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
        drawSticker();

        var len = shards.length;
        if (len > 0) {
            if (timer_delay > 0) {
                timer_delay = timer_delay - DRAW_SPEED;
            } else {
                opacity = (opacity > heal_step) ? opacity - heal_step : 0;
                timer_heal = timer_heal - DRAW_SPEED;
            }
            
            // Create shards from first canvas
            for (var i = 0; i < len; i++) {
                var shard = shards[i];
                // Cache for slight performance increase
                var corner1 = shard.corner1; 
                var rotation = shard.rotation;
                            
                // Draw shard onto second canvas
                ctx2.save();
                
                // Clip a triangular shape of the canvas
                ctx2.beginPath();
                ctx2.moveTo(corner1[0], corner1[1]);
                ctx2.lineTo(shard.corner2[0], shard.corner2[1]);
                ctx2.lineTo(shard.corner3[0], shard.corner3[1]);
                ctx2.lineTo(corner1[0], corner1[1]);
                ctx2.lineWidth = 1;
                ctx2.strokeStyle = 'rgba(30, 30, 30, ' + opacity + ')';
                ctx2.stroke();
                ctx2.closePath();
                ctx2.clip();
                
                // Slightly rotate each shard
                if (timer_heal < HEALING_TIME) {
                    shard.rotation = (rotation !== 0) ? rotation - shard.rotation_step : 0;
                }
                ctx2.rotate(shard.rotation);
                
                ctx2.drawImage(ctx1.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
                ctx2.restore();
            }
            
            // When the cracks have "healed", clear the shards array
            if (timer_heal < DRAW_SPEED) {
                shards = [];
            }
        } else {
            ctx2.drawImage(ctx1.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
        }
    
        setTimeout(doDraw, DRAW_SPEED, video, ctx1, ctx2, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    
    // Main function for cracking and fixing the screen
    function doCrack(event) {        
        // Get coords
        var coords = (event) ? getCoords(event) : [];
        
        opacity = 1;
        createShards(coords);
        
        timer_delay = HEALING_DELAY;
        timer_heal = HEALING_TIME;
    }

    function drawSticker() {
      var x = (windowwidth / 2) - 125,
          y = (windowheight / 2) - 100;

      context1.lineWidth = 15;
      context1.lineCap = 'square';
      context1.lineJoin = 'round';
      context1.strokeStyle = 'red';
      context1.shadowColor = 'rgba(0,0,0,0)';
      context1.strokeRect(x, y, 300, 190);
      context1.font = '35px Open Sans';
      context1.fillStyle = '#fff';
      context1.shadowColor = '#000';
      context1.shadowOffsetX = 2;
      context1.shadowOffsetY = 2;                                                                                                                   
      context1.shadowBlur = 1;
      context1.fillText('IN CASE OF', x + 50, y + 65);
      context1.fillText('EMERGENCY', x + 42, y + 110);
      context1.fillText('BREAK GLASS', x + 32, y + 155);
    }
    
    document[mouse_down] = doCrack;
    
    // Start drawing the video on page load thanks to "autoplay" attribute
    video.addEventListener('play', function() {
        // Calculate video and window height.
        // Note that final video size will always be greater than or equal to window size.        
        canvas1.width = windowwidth;
        canvas1.height = windowheight;
        canvas2.width = windowwidth;
        canvas2.height = windowheight;
        
        var windowratio = windowwidth / windowheight;
        var videoratio = this.videoWidth / this.videoHeight;
        var sw, sh, dw, dh;
        var sx = 0;
        var sy = 0;
        
        if (videoratio > windowratio) {
            // Video is wider than screen, so match height to screen height
            dh = windowheight;
            dw = windowwidth;
            sh = this.videoHeight;
            sw = (sh * windowratio) >> 0;
        } else {
            // Video is taller than screen, so match width to screen width
            dh = windowheight;
            dw = windowwidth;
            sw = this.videoWidth;
            sh = (sw / windowratio) >> 0; // Round to an integer
        }
        
        doDraw(this, context1, context2, sx, sy, sw, sh, 0, 0, dw, dh);
    },false);

    // Get the stream from the camera using getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, toString: function(){return 'video';}}, successCallback, errorCallback);

        function successCallback(stream) {
            // Replace the source of the video element with the stream from the camera
            video.src = (window.webkitURL) ? window.webkitURL.createObjectURL(stream) : stream;
            video.play();
        }
        
        function errorCallback(error) {
            if (error) console.error('An error occurred: [CODE ' + error.code + ']');
            video.play();
        }
    } else {
        console.log('Native web camera streaming (getUserMedia) is not supported in this browser.');
        video.play();
    }
},false);
