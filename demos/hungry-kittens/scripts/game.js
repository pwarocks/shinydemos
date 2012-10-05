/* Hungry Kittens
Author: Luz Caballero (@gerbille)*/

var Game = function() {
	var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

	var messageBox = document.getElementById("messages");
	
	//arrows = [left, up, right, down]
	var arrows = [false, false, false, false];
	
	var cats = {};
	var me, socket;

  // creates a scene using sprite.js
	var SCENE_WIDTH = 500;
	var SCENE_HEIGHT = 490;
	var scene = sjs.Scene({ parent:container, w: SCENE_WIDTH, h: SCENE_HEIGHT, autoPause: false });
	var ticker;

  // plays meow sound, if this cat meows also broadcasts to server
	var meow = function (broadcast) {
		var a = document.createElement("audio");
		a.src = "../sounds/meow" + (Math.round(Math.random()*10) % 5) + ".wav";
		a.addEventListener("ended", function () { a.parentNode.removeChild(a); }, false);
		document.body.appendChild(a);
		a.play();
		if (broadcast)
			socket.send(JSON.stringify({ type: "meow", data: me.catId }));
	}

  // create Cat as a subclass of Sprite
	var Cat = function (scene, data) {
		var w = 32; // side of the cat's sprite frame, in px
		this.catId = data.id;
		this.name = data.name;
		this.race = this.catId % 4; // assigning one of four races in the sprite sheet (we're an equal opportunity app)
		this.isJumping = false;
		this.jumpSpeed = 15; // initial jumping speed
		this.ySpeed = 0;
		this.frame = 0;
		this.looking = "left";

		//Sprite by WidgetWorx @ http://www.widgetworx.com/widgetworx/portfolio/spritelib.html
		sjs.Sprite.call(this, scene, "../images/sprite.gif", {
			size: [w, w],
			x: data.x,
			y: 0,
			xoffset: this.race * 3 * w,
			yoffset: 5 * w,
			layer: scene.layers.default
		});

		// adding a tag with the kitten's name
		var tag = document.createElement("span");
		tag.className = "nametag";
		tag.textContent = this.name;
		this.dom.appendChild(tag);
	}

	Cat.prototype = Object.create(sjs.Sprite.prototype, {
		turnHead: { value: function (direction) {
			if (direction == "left")
				this.lookLeft();
			else if (direction == "right")
				this.lookRight();
		}},

		lookLeft: { value: function () {
			this.looking = "left";
			this.setYOffset(5*this.w);
		}},

		lookRight: { value: function () {
			this.looking = "right";
			this.setYOffset(6*this.w);
		}},

		walk: { value: function () {
			this.frame = ++this.frame % 3;
			this.setXOffset((this.frame + this.race * 3) * this.w);
		}},

		jump: { value: function() {
			if (!this.isJumping) {
				this.isJumping = true;
				this.ySpeed = this.jumpSpeed;
			}
		}},

		move: { value: function (x, y, boundingX) {
			sjs.Sprite.prototype.move.call(this, x, y);
			if (this.x > boundingX)
				this.setX(-this.w);
			if (this.x < -this.w)
				this.setX(boundingX);
			return this;
		}},

		update: { value: function () {
			if (this.isJumping) {
				this.setY(this.y - this.ySpeed);
				this.ySpeed--;
				if (this.ySpeed < -this.jumpSpeed){
					this.isJumping = false;
				}
			}
			return sjs.Sprite.prototype.update.call(this);
		}}
	});

	var sendMove = function () {
		socket.send(JSON.stringify({
			type: "move",
			data: {
				id: me.catId,
				x: me.x,
				y: me.y,
				looking: me.looking
			}
		}));
	}

  // update the cats' positions
	var paint = function() {
	  //handle user input
		var x = 0, y = 0, step = 5;

		if (arrows[LEFT]) {
			me.walk();
			me.lookLeft()
			x -= step;
		}
		if (arrows[RIGHT]) {
			me.walk();
			me.lookRight();
			x += step;
		}
		if (arrows[UP]){
			me.jump();
		}
    
    /* 
    //debug function, shows the keys that are being pressed
    var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;
  	var stateNameMapping = [{i: LEFT, n: "left"},
  							{i: UP, n: "up"},
  							{i: RIGHT, n: "right"},
  							{i: DOWN, n: "down"}];
    
		var msg = stateNameMapping.filter(function (e) { return arrows[e.i] }).map(function (e) { return e.n }).join(" + ");
		messageBox.innerHTML = msg || "Use the arrows to move.";
		*/
    
    // update cats' positions
		for (var id in cats) {
			var cat = cats[id];
			// if the cat has left the game, skip it
			if (!cat){
				continue;
			}
			// update this cat
			if(cat == me && (x || y || cat.isJumping)) {
				me.move(x, y, SCENE_HEIGHT).update();
				sendMove();
			} else {
			  //update the other cats
				cat.update();
			}
		}

		if (ticker.currentTick % 20 == 0)
			document.getElementById("fps").innerHTML = ticker.fps + "fps";
	};

  // start game
	var start = function() {

		var defaultName = "Reginald";
		var name = prompt("Please name your kitten", defaultName) || defaultName;

		//connect to server
		socket = new WebSocket('ws://' + location.host + '/?name=' + name.slice(0, 10));

		var handlers = {
		  // server sends data about peers in the room when connection is established
			"connected": function (data) {
			  //add a kitten to the scene for each peer
				for (var id in data.cats) {
					cats[data.cats[id].id] = new Cat(scene, data.cats[id]);
				}
        
        // new peer gets id assigned by the server, and appears in random position in the scene
				me = cats[data.id];
				me.position(Math.round(Math.random()*SCENE_WIDTH), SCENE_HEIGHT - me.h);
				sendMove();

        // listen to keydown/keyup events: arrows = [left, up, right, down] keyCodes 37 to 40, and space = 32  
				window.addEventListener('keydown', function(e) {
					if (e.keyCode >= 37 && e.keyCode <= 40){
						arrows[e.keyCode - 37] = true;
					} else if (e.keyCode == 32){
						meow(true);
					}
				}, false);

				window.addEventListener('keyup', function(e) {
					if (e.keyCode >= 37 && e.keyCode <= 40){
						arrows[e.keyCode - 37] = false;
					}
				}, false);
        
				document.getElementById("room").innerHTML = data.roomId;
			},
      
      // if a new peer connects, the server broadcasts the new cat
			"new-cat": function(cat) {
				if (cat.id != me.catId){
					cats[cat.id] = new Cat(scene, cat);
				}
			},
      
      // move all the cats! \o/
			"moved": function(data) {
				for (var id in cats) {
					var cat = cats[id];
					if (cat.catId != me.catId) {
						cat.setX(+data[cat.catId].x);
						cat.setY(+data[cat.catId].y);
						cat.turnHead(data[cat.catId].looking);
					}
				}
			},
      
      // used by alternative mechanism used to remove cats b/c Opera has problems with "unload" events on window closing
			"ping": function () {
				socket.send(JSON.stringify({ type: "pong", data: me.catId }));
			},

      // when a peer closes the window, remove its cat
			"unload": function (id) {
				cats[id].remove();
				delete cats[id];
			},

      // echo peers' meows
			"meow": function (id) {
				if (id != me.catId){
					meow();
				}
			}
		}

    /* handle messages:
    { type: "unload", data: cat.id } -> remove a cat, it provides the cat's id
    { type: "new-cat", data: cat } -> add a new cat, it gives you the cat
    { type: "moved", data: rooms[cat.roomId] } -> move the cats, gives you the whole room where the cats are
    { type: "meow", data: id} -> echo meow, provides id of the meowing cat
    */
		socket.onmessage = function (e) {
			var o;
			try { o = JSON.parse(e.data); } catch (ex) { return; }
			if (!(o.type in handlers)){
				return;
			} else {
			handlers[o.type](o.data);
		  }
		}

		socket.onclose = function () {}
    
    // when the page closes, send socket.close to server to remove cat tied to this page
		window.addEventListener("unload", function () {
			socket.close();
		}, false);

    // use sprite.js ticker to animate the scene: call paint in each tick
		ticker = scene.Ticker(paint, { useAnimationFrame: true });
		// start the ticker
		ticker.run();
	};

	// Public API
	return {
		start: start
	};
}

window.onload = function () {
	new Game().start();
}
