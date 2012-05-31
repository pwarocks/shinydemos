/* Basic touch controller
   uses adapted script from Seb-Lee Delisle's JSTouchController https://github.com/sebleedelisle/JSTouchController */

var canvas,
	c, // c is the canvas' context 2D
	container;

var mouseX, mouseY, 
// is this running in a touch capable environment?
touchable = 'ontouchstart' in window || 'onMozTouchDown' in window || 'createTouch' in document,
touches = []; // array of touch vectors

function resetCanvas (e) {  
	// resize the canvas - but remember - this clears the canvas too. 
	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight;
	//make sure we scroll to the top left. 
	window.scrollTo(0,0); 
}

function loop() {
	/* hack to work around lack of orientationchange/resize event */
	if(canvas.height != window.innerHeight) {
		canvas.width = window.innerWidth; 
		canvas.height = window.innerHeight; 
	}
	c.clearRect(0,0,canvas.width, canvas.height);
	c.strokeStyle = "cyan";
	c.lineWidth = "6";
	/* need to handle canvas offsetLeft/offsetTop once we have SD panel */
	for(var i=0, l=touches.length; i<l; i++) {
		c.beginPath(); 
		c.arc(touches[i].clientX, touches[i].clientY, 50, 0, Math.PI*2, true); 
		c.stroke();
	}
	if(touches.length>1) {
		c.beginPath();
		c.lineWidth = "2";
		c.moveTo(touches[0].clientX,touches[0].clientY);
		for(var i=1, l=touches.length; i<l; i++) {
			c.lineTo(touches[i].clientX,touches[i].clientY);
		}
		c.stroke();
	}
}

function touchHandler(e) {
	e.preventDefault();
	touches = e.touches;
}

function init() {
	canvas = document.createElement( 'canvas' );
	c = canvas.getContext( '2d' );
	container = document.createElement( 'div' );
	container.className = "container";
	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight; 
	container.appendChild(canvas);	
	document.body.appendChild( container );
	c.strokeStyle = "#ffffff";
	c.lineWidth =2;
	
	if(touchable) {
		canvas.addEventListener( 'touchstart', touchHandler, false );
		canvas.addEventListener( 'touchmove', touchHandler, false );
		canvas.addEventListener( 'touchend', touchHandler, false );
		setInterval(loop, 1000/35);
	}
	
	
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(init,100);
},false);