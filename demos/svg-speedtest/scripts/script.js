var xmlns="http://www.w3.org/2000/svg";
var xlink="http://www.w3.org/1999/xlink";
var root=document.documentElement;
var x_dir = 1;
var y_dir = 1;

var beta = x_dir;
var gamma = y_dir;
var acc_x = 1.1;
var acc_y = 1.1;
var vh = root.clientHeight;
var vw = root.clientWidth;

var bbox_x;
var bbox_y;
var bbox_x_other;
var bbox_y_other;
var last_mark_x;
var last_mark_y;
var score = 0;
var previous_best = 0;

var start = new Date().getTime();  
var time; 
var elapsed;
var final_time;  

var marks = [];
var filledMarks = [];
var p1 = {'x': 95, 'y': 85};
var p2 = {'x': 390, 'y': 360};
var p3 = {'x': 330, 'y': 200};
var p4 = {'x': 90, 'y': 360};
var p5 = {'x': 290, 'y': 460};
marks.push(p1, p2, p3, p4, p5);

var old_d = new Date();

previous_best = localStorage.getItem('best') || 0;

var therect = document.querySelector("#borderrect");
var rect_x = parseInt(therect.getAttribute('x'), 10);
var rect_width = parseInt(therect.getAttribute('width'), 10);
var rect_x_other = rect_x + rect_width;
var rect_y = parseInt(therect.getAttribute('y'), 10);
var rect_height = parseInt(therect.getAttribute('height'), 10);
var rect_y_other = rect_y + rect_height;

if (window.DeviceOrientationEvent || window.OrientationEvent){
	window.addEventListener('devicemotion', capture_acc, true);
	window.addEventListener('deviceorientation', capture, true);
} else {
	var error_text = document.createElementNS(xmlns, "text"); 
	error_text.setAttribute('class', 'errortext');
	error_text.setAttribute('fill', 'red');
	error_text.setAttribute('x', 10);
	error_text.setAttribute('y', 560);
	error_text.setAttribute('font-size', 20);
	error_text.textContent = "The W3C Device Orientation specification is not supported by this browser.";
	root.appendChild(error_text);
	
	var text = document.querySelector("#mytext");
	text.setAttribute('class', 'errortext');
	text.setAttribute('fill', '#ecedf0');
	text.setAttribute('stroke', 'none');
	text.setAttribute('font-size', 20);
	text.textContent = "This demo will not work properly due to lack of support for it.";
}

thefunc();
var thetime = setInterval(doTime, 100);
var animtime = setInterval(containerfunc, 10);


function thefunc(){
	var c = document.createElementNS(xmlns, "circle");
	c.setAttribute('cx', 100);
	c.setAttribute('cy', 90);
	c.setAttribute('fill', 'red');
	c.setAttribute('r', 20);
	c.setAttribute('id', 'ball');
	
	var rg = document.createElementNS(xmlns, "radialGradient");
	rg.setAttribute('id', 'radgrad');
	var rg_stop1 = document.createElementNS(xmlns, "stop");
	rg_stop1.setAttribute('offset', 0.2);
	rg_stop1.setAttribute('stop-color', '#888');
	rg.appendChild(rg_stop1);
	var rg_stop2 = document.createElementNS(xmlns, "stop");
	rg_stop2.setAttribute('offset', 1);
	rg_stop2.setAttribute('stop-color', '#333');
	rg.appendChild(rg_stop2);
	root.appendChild(rg);
	
	c.setAttribute('fill', 'url(#radgrad)');
	root.appendChild(c);
	
	var l = document.createElementNS(xmlns, "line");
}

function capture(event){
	beta = event.beta;
	gamma = (-1)*event.gamma;
	anim();
}

function capture_acc(event){
	acc_x = (-2.0)*event.accelerationIncludingGravity.x ;
	acc_y = (2.0)*event.accelerationIncludingGravity.y ;
}

function anim(){
	var ball = document.querySelector("#ball");
	var bbox = ball.getBBox();
	bbox_x = bbox.x;
	bbox_y = bbox.y;
	bbox_x_other = bbox.x + 40;
	bbox_y_other = bbox.y + 40;
	var bbox_radius_x = Math.round(bbox.x + 20);
	var bbox_radius_y = Math.round(bbox.y + 20);
	
	gamma += acc_x; 
	beta += acc_y;
	
	if (bbox_x <= rect_x){ // left side, x
	
		if (bbox_y >=rect_y && bbox_y_other <= rect_y_other){
			ball.cy.baseVal.value += acc_y;
		}
	
		if (acc_x > 0){
			ball.cx.baseVal.value += acc_x;
		}
	
		} else if (bbox_y <= rect_y){ // top side, y
	
			if (bbox_x >= rect_x && bbox_x_other <=rect_x_other){
			ball.cx.baseVal.value += acc_x;
			}
	
	
			if (acc_y > 0){
				ball.cy.baseVal.value += acc_y;
			}
			
		} else if (bbox_x_other >= rect_x_other){ //right side, x
	
			if (bbox_y >= rect_y && bbox_y_other <= rect_y_other){
				ball.cy.baseVal.value += acc_y;
			}
			
			if (acc_x < 0){
				ball.cx.baseVal.value += acc_x;
			}
	
		} else if (bbox_y_other >= rect_y_other){ //bottom side, x
			if (bbox_x >= 20 && bbox_x_other <=770){
				ball.cx.baseVal.value += acc_x;
			}
	
			if (acc_y < 0){
				ball.cy.baseVal.value  += acc_y;
			}
	
		} else {
			var prev_cx = ball.cx.baseVal.value;
			var prev_cy = ball.cy.baseVal.value;
	
			for (var i=0; i<marks.length; i++){
				if (bbox_radius_x == marks[i].x && bbox_radius_y == marks[i].y){
					if (bbox_radius_x!=last_mark_x && bbox_radius_y != last_mark_y){
						alert('Got it!');	
					}
	
					var alreadyDone = ifAlreadyDone(bbox_radius_x, bbox_radius_y);		
					if (alreadyDone === false) { 
						filledMarks.push({'x':marks[i].x, 'y':marks[i].y});
						updateScore();
	
						if (filledMarks.length == 5){
							final_time = time;
							if (elapsed < previous_best || previous_best === 0){
								localStorage.setItem('best', elapsed);
								updateTime(final_time, true);
							} else {
								updateTime(final_time);
							} 
						}
	
						last_mark_x = marks[i].x; last_mark_y = marks[i].y;
						mark_this_hole_different(i);
					}	
				}
			}
	
			ball.cx.baseVal.value += acc_x;
			ball.cy.baseVal.value += acc_y;
	}
}

/*General functions defined below*/

function mark_all_holes_default(){
	for (var j=0; j<marks.length; j++){
		var current_hole = document.querySelectorAll('circle')[j];
		current_hole.setAttribute("fill", "url('#holegrad')");
	}
}

function mark_this_hole_different(i){
	var current_hole = document.querySelectorAll('circle')[i];
	current_hole.setAttribute("fill", "url('#presentgrad')");
}


function containerfunc(){
	anim();
}


function doTime(){
	var elapsedTime = new Date().getTime() - start;		
	var elapsed_f = formatTime(elapsedTime);	
	elapsed = elapsedTime;
	time = elapsed_f;
}

function formatTime(time) {
	var eTime = ((time / 1000) % 60);
	return eTime;
}

function ifAlreadyDone(x, y) {
	var f_status= false;
	for (var i=0; i<filledMarks.length; i++){
		if (x == filledMarks[i].x && y == filledMarks[i].y){
			f_status = true;
			break;
		} 
	} 
	return f_status;
}

function updateScore() {
	score++;
	var scoretext = document.querySelector("#mytext");
	scoretext.textContent = "Score: "+score +" of 5 down";
}

function round2three(number) {
	return Math.round(number*1000)/1000;
}

function updateTime(final_time, new_record) {
	var text = document.querySelector("#mytext");
	text.setAttribute('font-size', 17);
	
	var pb;
	if (previous_best === 0){ 
		pb = "--";		
		text.textContent = "You took "+round2three(final_time)+" seconds. Record time: "+pb+" seconds.";
	} else { 
		pb = previous_best;
		text.textContent = "You took "+round2three(final_time)+" seconds. Record time: "+(pb/1000)+" seconds.";
	}
	 
	if (new_record === true){
		text.textContent = "Congrats! You scored a new record time of "+round2three(final_time)+" seconds.";
	}
}

anim();