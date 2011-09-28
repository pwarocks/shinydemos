/*
 * Version 0.1
 * Really messy, totally unoptimised and very incomplete.
 * TODO:
 * Crop off the video stream correctly.
 * Centre the webcam stream in the canvas. (22nd Sep: Not working in Android labs build)
 * Break glass where the canvas was clicked/touched.
 * Use mask to create irregular shapes of shard.
 */

document.addEventListener('DOMContentLoaded', function(){
    var shards = [];
    var coords = [];
    var SHARD_NUM = 2;
    var isCracked = false;
    var RAD = Math.PI/180;
    var SUPPORTS_TOUCH = 'createTouch' in document;
    
    var mouse_down = (SUPPORTS_TOUCH ? 'ontouchstart' : 'onmousedown');
    
    document[mouse_down] = function(event) {
        doCrack(event);
    };
    
    // Shard constructor
    function Shard() {
        this.originX = 0;
        this.originY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.rotation = 0;
        this.force = 0;
        //this.z = 0;
        this.moveX= 0;
        this.moveY= 0;
        this.moveRotation = 0;
        
        this.videoX = 0;
        this.videoY = 0;
    }
    
    function createShards() {
        var offsetX = 0;
        var offsetY = 0;
        var y = 0;
        var x = 0;
        for (var i = 0; i < 3; i++) {
            var shard = new Shard();
            /*
            shard.videoX = x;
            shard.videoY = y;
            shard.originX = offsetX + x;
            shard.originY = offsetY + y;
            shard.currentX = shard.originX;
            shard.currentY = shard.originY;
            */
            shard.videoX = x;
            shard.originX = x;
            shard.currentX = x;
            shard.rotation = Math.random(0.5) - 0.5;
            shards.push(shard);
            x += 100;
            y += 100;
        }
        //shards[0].
    }

       

    function doDraw(v, c1, c2, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (v.paused || v.ended) return false;
        // Draw video onto first canvas
        c1.drawImage(v, sx, sy, sw, sh, dx, dy, dw, dh);
        
        // Create shards from first canvas
        for (var i = 0, len = shards.length; i < len; i++) {
            var shard = shards[i];
            
            if (shard.force > 0.0001) {
                //expand
                /*
                shard.moveX *= shard.force;
                shard.moveY *= shard.force;
                shard.moveRotation *= shard.force;
                shard.currentX += shard.moveX;
                shard.currentY += shard.moveY;
                shard.rotation += shard.moveRotation;
                shard.rotation %= 360;
                shard.force *= 0.9;
                if (shard.currentX <= 0 || shard.currentX >= 100) {
                    shard.moveX *= -1;
                }
                if (shard.currentY <= 0 || shard.currentY >= 50) {
                    shard.moveY *= -1;
                }
                */
            } else if (shard.rotation != 0 || shard.currentX != shard.originX || shard.currentY != shard.originY) {
                //contract
                /*
                var diffx = (shard.originX-shard.currentX)*0.2;
                var diffy = (shard.originY-shard.currentY)*0.2;
                var diffRot = (0-shard.rotation)*0.2;
                
                if (Math.abs(diffx) < 0.5) {
                    shard.currentX = shard.originX;
                }else{
                    shard.currentX += diffx;
                }
                if (Math.abs(diffy) < 0.5) {
                    shard.currentY = shard.originY;
                } else {
                    shard.currentY += diffy;
                }
                if (Math.abs(diffRot) < 0.5) {
                    shard.rotation = 0;
                } else {
                    shard.rotation += diffRot;
                }
                */
            } else {
                shard.force = 0;
            }
            
            // Draw shard onto second canvas
            c2.save();
            //c2.translate(35, -50);
            //c2.rotate(0.1);
            c2.translate(shard.currentX, shard.currentY);
            //c2.rotate(shard.rotation * RAD);
            c2.rotate(shard.rotation);
            
            // Clip a triangular shape of the canvas
            c2.beginPath();
            c2.moveTo(100, 100);
            c2.lineTo(300, 100);
            c2.lineTo(100, 300);
            c2.lineTo(100, 100);
            c2.stroke();
            c2.closePath();
            c2.clip();
            
            c2.drawImage(c1.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
            c2.restore();
            /*
            draw.save();
            draw.translate(tile.currentX, tile.currentY);
            draw.rotate(tile.rotation*RAD);
            draw.drawImage(copycanvas, tile.videoX, tile.videoY, TILE_WIDTH, TILE_HEIGHT, -TILE_CENTER_WIDTH, -TILE_CENTER_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            draw.restore();
            */
        }
    
        setTimeout(doDraw, 40, v, c1, c2, sx, sy, sw, sh, dx, dy, dw, dh); // Draw at 25 fps (every 40 milliseconds)
        //opera.postError('width: ' + c1.canvas.width + ' : height: ' + c1.canvas.height);
    }
    
    var video = document.querySelector('video');;
    var canvas1 = document.getElementById('canvas1');
    var context1 = canvas1.getContext('2d');
    var canvas2 = document.getElementById('canvas2');
    var context2 = canvas2.getContext('2d');
    
    createShards();
    
    function doCrack() {
        if (!isCracked) {
            coords = getCoords(event);
            
			context2.clearRect(0, 0, context2.width, context2.height);
            //createShards();
            //opera.postError(coords);
            
            canvas1.style.display = 'none';
            canvas2.style.display = 'block';
            isCracked = true;
        } else {
			shards = [];
            canvas1.style.display = 'block';
            canvas2.style.display = 'none';
            isCracked = false;
        }
    }
    
    
    //document.addEventListener('click', doCrack, false);
    
    //createShards();
    
    // Returns an array containing the x and y coordinates of an event (e.g. mouse click)
    // Code from: http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
    function getCoords(event) {
        var x, y;
        if (event.pageX || event.pageY) { 
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
    
    
    //canvas1.addEventListener('click', getCoords, false);


    video.addEventListener('play', function(){
        // Calculate video and window height.
        // Note that final video size will always be greater than or equal to window size.
        var windowwidth = window.innerWidth;
        var windowheight = window.innerHeight;
        
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
        navigator.getUserMedia('video user', successCallback, errorCallback);
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
