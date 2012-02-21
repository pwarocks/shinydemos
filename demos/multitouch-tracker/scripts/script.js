
var canvas,
	c, // c is the canvas' context 2D
	container;

var mouseX, mouseY, 
// is this running in a touch capable environment?
touchable = 'createTouch' in document,
touches = []; // array of touch vectors

function resetCanvas (e) {  
	// resize the canvas - but remember - this clears the canvas too. 
	canvas.width = window.innerWidth; 
	canvas.height = window.innerHeight;
	//make sure we scroll to the top left. 
	window.scrollTo(0,0); 
}

function loop() {
	c.clearRect(0,0,canvas.width, canvas.height);
	for(var i=0; i<touches.length; i++) {
		/* c.beginPath(); 
		c.fillStyle = "white";
		c.fillText("touch id : "+touch.identifier+" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30);  */
		c.beginPath(); 
		c.strokeStyle = "cyan";
		c.lineWidth = "6";
		c.arc(touches[i].clientX, touches[i].clientY, 50, 0, Math.PI*2, true); 
		c.stroke();
	}
	if(touches.length>1) {
		c.beginPath();
		c.lineWidth = "2";
		c.moveTo(touches[0].clientX,touches[0].clientY);
		for(var i=1; i<touches.length; i++) {
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
	document.body.appendChild( container );
	container.appendChild(canvas);	
	c.strokeStyle = "#ffffff";
	c.lineWidth =2;
	
	if(touchable) {
		canvas.addEventListener( 'touchstart', touchHandler, false );
		canvas.addEventListener( 'touchmove', touchHandler, false );
		canvas.addEventListener( 'touchend', touchHandler, false );
		setInterval(loop, 1000/35);
	}
	
	
}

window.addEventListener('load',init,false);