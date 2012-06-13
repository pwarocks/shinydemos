//small library functions.
var $ = function(d) { return document.getElementById(d); },
    $$ = function(d) { return document.querySelectorAll(d); },
    prefixes = ['', '-o-', '-webkit-', '-moz-', '-ms-'],
    setStyles = function(dom, options, usePrefix) {
      var style = dom.style;
      for (var opt in options) {
        for (var i = 0, l = usePrefix ? prefixes.length : 1; i < l; ++i) {
          style.setProperty(prefixes[i] + opt, options[opt], '');
        }
      }
    },
    flushStyles = function(dom, properties, usePrefix) {
  	  properties.forEach(function (p) {
        for (var i = 0, l = usePrefix ? prefixes.length : 1; i < l; ++i) {
  		    getComputedStyle(dom).getPropertyValue(prefixes[i] + p);
  	    }
  	  });
    };    

//Cross browser requestAnimationFrame
(function() {
  this.Fx = {};

  var found = false,
      me = this;

  ['oRequestAnimationFrame',
   'webkitRequestAnimationFrame',
   'msRequestAnimationFrame',
   'mozRequestAnimationFrame',
   'requestAnimationFrame'].forEach(function(impl) {
    if (impl in this) {
      Fx.requestAnimationFrame = function(callback) {
        me[impl](function() {
          callback();
        });
      };
      found = true;
    }
  });
  
  if (!found) {
    Fx.requestAnimationFrame = function(callback) {
      setTimeout(function() {
        callback();
      }, 1000 / 60);
    };
  }
})();


//Extend dom elements with some
//functionality
function DOM(id) {
  this.element = $(id);
}

DOM.prototype = {
  setStyles: function(options, prefix) {
    setStyles(this.element, options, prefix);
  },
  flushStyles: function(options, prefix) {
    flushStyles(this.element, options, prefix);
  }
};

//Dog element
function Dog (id) {
  DOM.call(this, id);

  this.setStyles({
    'animation-name': '',
    'animation-duration': '3s',
    'animation-iteration-count': '1',
    'transform-origin': '40px 40px'
  }, true);
}

Dog.prototype = Object.create(DOM.prototype, {
  dixit: {
    value: ["Wicked!!!",
            "Wooo-hooo!",
            "Oh, my! This was unexpected...",
            "Yippeeeee!",
            "Who let the shoes out?",
            "Yeeeee-haw!!",
            "Blimey!",
            "What is this witchcraft?!?!",
            "Zoinks!",
            "Shiver-my-merkin!",
            "What a ride!",
            "Squally pocker dum!",
            "GAZOOBA!"]
  }
});

//Shoe element
function Shoe (id) {
  this.element = document.createElement('div');
}

Shoe.prototype = Object.create(DOM.prototype, {
  timer: {
    value: null,
    writable: true
  },
  shoeInit: {
    value: 920,
    writable: true
  },
  add: {
    value: function(countryside) {
      var shoeInit = this.shoeInit,
          element = this.element;

      element.setAttribute('id', 'shoe');
      element.classList.remove('hide');

      countryside.element.appendChild(this.element);
      countryside.imageInX = countryside.imageX;

      this.setStyles({
        'left': shoeInit + 'px'
      });
    }
  },
  remove: {
    value: function(countryside) {
      clearTimeout(this.timer);
      this.element.classList.add('hide');
      this.timer = setTimeout(this.add.bind(this, countryside), 1000);
    }
  }
});

//old bicycle.
function Bicycle (id) {
  DOM.call(this, id);
  this.smallWheel = $('small_wheel');
  this.bigWheel = $('big_wheel');
  this.setStyles({
    'animation-name': '',
    'animation-duration': '3s',
    'animation-iteration-count': '1',
    'transform-origin': '30px 312px'
  }, true);

  setStyles(this.smallWheel, {
    'animation-name': '',
    'animation-duration': '5s',
    'animation-iteration-count': 'infinite',
    'transform-origin': 'center center',
    'animation-timing-function': 'linear'
  }, true);

  setStyles(this.bigWheel, {
    'animation-name': '',
    'animation-duration': '3s',
    'animation-iteration-count': 'infinite',
    'transform-origin': 'center center',
    'animation-timing-function': 'linear'
  }, true);
}

Bicycle.prototype = Object.create(DOM.prototype);

//countryside element
function Countryside (id) {
  DOM.call(this, id);
}

Countryside.prototype = Object.create(DOM.prototype, {
  imageX: {
    value: 0,
    writable: true
  },
  imageY: {
    value: 0,
    writable: true
  },
  imageInX: {
    value: 0,
    writable: true
  },
  imageInY: {
    value: 0,
    writable: true
  },
  moveBackground: {
    value: function(x, y) {
      this.imageX  = (this.imageX + x); //image width
      // this.imageInX %= 3658; //image width
      this.imageY += y;
      this.element.style.backgroundPosition = this.imageX + 'px ' + this.imageY + 'px';
    }
  }
});

//Bubble object
function Bubble (text) {
  var me = this,
      id = 'bubble' + Bubble.id++;

  Bubble.pool.push(me);

  var element = document.createElement('div');
  element.setAttribute('id', id);
  element.classList.add('bubble');

  var box = document.createElement('div');
  box.setAttribute('id', id + 'box');
  box.classList.add('bubble1');
  box.innerHTML = text;

  var edge = document.createElement('div');
  edge.setAttribute('id', id + 'edge');
  edge.classList.add('bubble2');

  element.appendChild(box);
  element.appendChild(edge);

  me.element = element;

  me.setStyles({
    'top': '175px',
    'left': '144px'
  });
}

Bubble.id = 0;
Bubble.pool = [];
Bubble.update = function(scene) {
  this.pool.forEach(function(bubble, index) {
    var element = bubble.element,
        style = element.style,
        top = parseInt(style.top, 10),
        height = element.offsetHeight + 1,
        imageX = scene.countryside.imageX;

    if (top >= -height) {
      style.top = (top - 1) + 'px';
      style.left = ((Math.floor( (imageX - bubble.backBubIn) / 10 ) + 144) || -500) + 'px';
    } else {
      this.splice(index, 1);
    }
  }, this.pool);
};

Bubble.prototype = Object.create(DOM.prototype);


window.addEventListener('DOMContentLoaded', function() {
  //create dom elements
  var dog  = new Dog('doggie'),
      bike = new Bicycle('old_bicycle'),
      shoe = new Shoe('shoe'),
      countryside = new Countryside('countryside'),
      music = $('music'),
      effect = $('effect'),
      scene = { dog: dog, bike: bike, shoe: shoe, countryside: countryside },
      button = $('start'),
      toggleSound = $('sound'),
      riding = false,
      setRide = function(set) { riding = set; };

  //add up and down listeners
  button.addEventListener('click', function() {
    setRide(true);
    if (music.paused) {
      music.play();
    } else {
      music.pause();
    }
  }, false);
  
  button.click();
  toggleSound.addEventListener('click', function() {
    music[music.paused ? 'play' : 'pause']();
  }, false);

  //add shoe
  shoe.add(countryside);

  //init loop
  loop();

  //loop
  function loop() {
    if (!riding) {
      Fx.requestAnimationFrame(loop);
      return;
    }

    //move the wheels
    setStyles(bike.smallWheel, {
      'animation-name': 'wheel'
    }, true);
    setStyles(bike.bigWheel, {
      'animation-name': 'wheel'
    }, true);

    /* motion rate 5px left */
    countryside.moveBackground(-2, 0);

    var imageX   = countryside.imageX,
        imageInX = countryside.imageInX,
        shoeInit = shoe.shoeInit;
        
    //console.log(imageX, imageInX, shoeInit, (imageX - imageInX + shoeInit) + 'px');
    shoe.setStyles({
      'left': (imageX - imageInX + shoeInit) + 'px'
    });
    

    //colision with the shoe when the shoe's left == 400
    if(imageX - imageInX + shoeInit == 416){
      //play sound effect
      if (!music.paused) {
        effect.play();
      }
      //reset animations
      bike.setStyles({
        'animation-name': ''
      }, true);
      dog.setStyles({
        'animation-name': ''
      }, true);
      //flush styles
      bike.flushStyles(['animation-name'], true);
      dog.flushStyles( ['animation-name'], true);
      setTimeout(function() {
        //set new animations
        bike.setStyles({
          'animation-name': 'willy'
        }, true);
        dog.setStyles({
          'animation-name': 'swirl'
        }, true);
      }, 10);
      //create a new bubble
      var bubble = new Bubble( dog.dixit[Math.random() * dog.dixit.length >> 0] );
      countryside.element.appendChild(bubble.element);

      setTimeout(function() {
        bubble.element.style.visibility = 'visible';
        bubble.backBubIn = countryside.imageX;
        shoe.remove(countryside);
      }, 1000);
    }

    Bubble.update(scene);

    Fx.requestAnimationFrame(loop);
  }
}, false);

