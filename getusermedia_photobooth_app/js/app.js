// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function(f,a){var h=document.createElement("div"),g=("backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex").split(" ");function e(j,k,l){return(j+(k-j)*l).toFixed(3)}function i(k,j,l){return k.substr(j,l||1)}function c(l,p,s){var n=2,m,q,o,t=[],k=[];while(m=3,q=arguments[n-1],n--){if(i(q,0)=="r"){q=q.match(/\d+/g);while(m--){t.push(~~q[m])}}else{if(q.length==4){q="#"+i(q,1)+i(q,1)+i(q,2)+i(q,2)+i(q,3)+i(q,3)}while(m--){t.push(parseInt(i(q,1+m*2,2),16))}}}while(m--){o=~~(t[m+3]+(t[m]-t[m+3])*s);k.push(o<0?0:o>255?255:o)}return"rgb("+k.join(",")+")"}function b(l){var k=parseFloat(l),j=l.replace(/^[\-\d\.]+/,"");return isNaN(k)?{v:j,f:c,u:""}:{v:k,f:e,u:j}}function d(m){var l,n={},k=g.length,j;h.innerHTML='<div style="'+m+'"></div>';l=h.childNodes[0].style;while(k--){if(j=l[g[k]]){n[g[k]]=b(j)}}return n}a[f]=function(p,m,j){p=typeof p=="string"?document.getElementById(p):p;j=j||{};var r=d(m),q=p.currentStyle?p.currentStyle:getComputedStyle(p,null),l,s={},n=+new Date,k=j.duration||200,u=n+k,o,t=j.easing||function(v){return(-Math.cos(v*Math.PI)/2)+0.5};for(l in r){s[l]=b(q[l])}o=setInterval(function(){var v=+new Date,w=v>u?1:(v-n)/k;for(l in r){p.style[l]=r[l].f(s[l].v,r[l].v,t(w))+r[l].u}if(v>u){clearInterval(o);j.after&&j.after()}},10)}})("emile",this);

// TODO:
// mail/attachment integration

(function(win, doc){
  var video = doc.querySelector('video'),
      snapshots = doc.getElementById('pics'),
      prompt = doc.getElementById('prompt'),
      photos = snapshots.getContext('2d'),
      img = new Image(),
      audio = new Audio('media/click.ogg'),
      button = doc.querySelector('button'),
      container = doc.getElementById('container'),
      showemail = doc.getElementById('emailme'),
      VIDEO_WIDTH, VIDEO_HEIGHT, flash,
      form = doc.querySelector('form');
      snaps = [
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 6, 150, 93.75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 105, 150, 93.75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 204, 150, 93.75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 5, 303, 150, 93.75);}
      ];
      
  var canvasPrep = (function(){
    photos.fillStyle = '#fff';
    photos.lineCap = 'square';
    photos.fillRect(0,0,160,402);
    photos.lineWidth = 2;
    photos.strokeStyle = '#515151';
    photos.strokeRect(0,0,160,402);
    photos.lineWidth = 1;
    photos.fillStyle = '#ccc';
    photos.fillRect(5, 6, 150, 93.75);
    photos.fillRect(5, 105, 150, 93.75);
    photos.fillRect(5, 204, 150, 93.75);
    photos.fillRect(5, 303, 150, 93.75);
  }());

  var computeAspect = function(){
    //compute correct size/aspect ratio for picture frame
    //browsers that don't have object fit will look wacky
    VIDEO_WIDTH = video.videoWidth;
    VIDEO_HEIGHT = video.videoHeight;
  };

  var takeSnaps = function(interval){
    var i = 0,
    id = setInterval(function(){
      if (snaps.length){
        snaps.shift()();
        showFlash();
        audio.play();
      }
    
      if (++i == 4){
        clearInterval(id);
        setTimeout(function(){
          showemail.className = '';
        }, 500);
      }
    }, interval);
  };
  
  var prepFlash = (function(){
    flash = doc.createElement('div');
    flash.id = 'flash';
    flash.className = 'hidden';
    container.appendChild(flash);
  }());
  
  var showFlash = function(){
    flash.className = '';
    emile(flash, 'opacity:0', {duration:250, after: function(){
      flash.style.opacity = .6;
      flash.className = 'hidden';
    }});
  };

  var fallback = function(){
    video.onloadedmetadata = function(){
      //not all browsers have video@muted yet.
      this.muted = true;
      computeAspect();
    };
  };
  
  var startButton = function(){
    prompt.className = '';
    setTimeout(function(){
      prompt.textContent = "2";
      setTimeout(function(){
        prompt.textContent = "1";
        setTimeout(function(){
          prompt.textContent = "Smile!";
          setTimeout(function(){
            video.play();
            takeSnaps(1200);
          }, 1);
        }, 1200);
      }, 1200);
    }, 1200);
  };
  
  var showEmailForm = function(){
    emile(container, 'opacity: 0', {duration:250, after: function(){
      container.parentNode.removeChild(container);
      showemail.parentNode.removeChild(showemail);
      snapshots.className = 'left';
      form.parentNode.className = '';
    }});
  };
  
  var init = (function(){
    navigator.getUserMedia ? 
      navigator.getUserMedia('video', function(stream){
        video.src = stream;
        video.onloadedmetadata = function(){
          computeAspect();
        }; 
      }, fallback) : fallback();
  }());
  
  showemail.onclick = showEmailForm;
  
  form.onsubmit = function(){
    alert('AJAX SUBMISSION TO PHP SCRIPT!!!!');
  };
  
  button.onclick = function(){
    this.className = 'hidden';
    startButton();
  };
}(window, document));