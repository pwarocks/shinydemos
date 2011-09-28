/*
 * Version 0.3
 * Getting there but still buggy and unoptimised.
 * TODO:
 * Crop off the video stream correctly. DONE
 * Centre the webcam stream in the canvas. (22nd Sep: Not working in Android labs build)
 * Divide glass into random parts. DONE
 * Break glass where the canvas was clicked/touched. DONE
 * Get the damn thing working on mobile. DONE
 * Add movement detection (device orientation).
 */
 
/* COMMON FUNCTIONS */
// Get random number between a range
// Code from: http://roshanbh.com.np/2008/09/get-random-number-range-two-numbers-javascript.html
function randomXToY(minVal, maxVal, floatVal) {
    var randVal = minVal + (Math.random() * (maxVal - minVal));
    return typeof floatVal === 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
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
    var shards = [];
    var coords = [];
    var SHARD_NUM = 2;
    var isCracked = false;
    var RAD = Math.PI/180;
    var SUPPORTS_TOUCH = 'createTouch' in document;
    var crack_coords = [120, 200];
    
	var windowwidth = window.innerWidth;
	var windowheight = window.innerHeight;
    
    var mouse_down = (SUPPORTS_TOUCH ? 'ontouchstart' : 'onmousedown');
    
    // Shard constructor
    function Shard() {
        this.originX = 0;
        this.originY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.rotation = 0;
        this.corner1 = crack_coords; // Make this an empty array
        this.corner2 = [];
        this.corner3 = [];
        //this.force = 0;
        //this.z = 0;
        this.moveX= 0;
        this.moveY= 0;
        this.moveRotation = 0;
        
        this.videoX = 0;
        this.videoY = 0;
    }
    
    function createShards(coords) {
        var offsetX = 0;
        var offsetY = 0;
        var y = 0;
        var x = 0;
        var shard_total = 100;
        var shard_num = 0;
        var all_sides = false;
        var step;
        
        do {
            var shard = new Shard();
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
            
            shard.videoX = x;
            shard.originX = x;
            shard.currentX = x;
            shard.rotation = randomXToY(-0.05, 0.05, 3);
            shards.push(shard);
            
            shard_num++;
        } while (shard_num < shard_total);        
    }

    function doDraw(v, c1, c2, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (v.paused || v.ended) return false;
        // Draw video onto first canvas
        c1.drawImage(v, sx, sy, sw, sh, dx, dy, dw, dh);
        
        var len = shards.length;
        if (len > 0) {
            // Create shards from first canvas
            for (var i = 0; i < len; i++) {
                var shard = shards[i];
                            
                // Draw shard onto second canvas
                c2.save();
                
                // Clip a triangular shape of the canvas
                c2.beginPath();
                c2.moveTo(shard.corner1[0], shard.corner1[1]);
                c2.lineTo(shard.corner2[0], shard.corner2[1]);
                c2.lineTo(shard.corner3[0], shard.corner3[1]);
                c2.lineTo(shard.corner1[0], shard.corner1[1]);
                c2.stroke();
                c2.closePath();
                c2.clip();
                
                // Slightly rotate each shard
                c2.rotate(shard.rotation);
                
                c2.drawImage(c1.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
                c2.restore();
            }
        } else {
            c2.drawImage(c1.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
        }
    
        setTimeout(doDraw, 40, v, c1, c2, sx, sy, sw, sh, dx, dy, dw, dh); // Draw at 25 fps (every 40 milliseconds)
    }
    
    var video = document.querySelector('video');;
    var canvas1 = document.getElementById('canvas1');
    var context1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    
    function doCrack(event) {
        if (!isCracked) {
            //canvas1.style.display = 'none';
            //canvas2.style.display = 'block';
            isCracked = true;
        } else {
            //canvas1.style.display = 'block';
            //canvas2.style.display = 'none';
            isCracked = false;
        }
    }
    
    document[mouse_down] = function(event) {
        // Get coords
        var coords = getCoords(event);
        //alert(coords);
        //coords = [100, 100];
        
        if (!isCracked) {
            // Create shards if necessary
            createShards(coords);
        } else {
            // Else clear the shards
            shards = [];
        }
        
        // Hide/show canvases
        doCrack();
    };
    


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
            dh = window.innerHeight;
            dw = window.innerWidth;
            sw = (this.videoHeight * windowratio) >> 0;
            sh = this.videoHeight;
            //sx = ((this.videoWidth - sw) / 2) >> 0;
        } else {
            // Video is taller than screen, so match width to screen width
            dw = window.innerWidth;
            dh = window.innerHeight;
            sw = this.videoWidth;
            sh = (this.videoWidth / windowratio) >> 0; // Round to an integer
            //sy = ((this.videoHeight - sh) / 2) >> 0; // Round to an integer
        }
        
        doDraw(this, context1, context2, sx, sy, sw, sh, 0, 0, dw, dh);
    },false);


    if (navigator.getUserMedia) {
        navigator.getUserMedia('video', successCallback, errorCallback);
        function successCallback(stream) {
            video.src = stream;
        }
        function errorCallback(error) {
            alert('An error occurred: [CODE ' + error.code + ']');
        }
    } else {
        document.write('Sorry - your browser doesn\'t have camera support.');
        opera.postError('Native web camera streaming is not supported in this browser.');
    }
    
},false);
