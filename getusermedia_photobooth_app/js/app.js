// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function(f,a){var h=document.createElement("div"),g=("backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex").split(" ");function e(j,k,l){return(j+(k-j)*l).toFixed(3)}function i(k,j,l){return k.substr(j,l||1)}function c(l,p,s){var n=2,m,q,o,t=[],k=[];while(m=3,q=arguments[n-1],n--){if(i(q,0)=="r"){q=q.match(/\d+/g);while(m--){t.push(~~q[m])}}else{if(q.length==4){q="#"+i(q,1)+i(q,1)+i(q,2)+i(q,2)+i(q,3)+i(q,3)}while(m--){t.push(parseInt(i(q,1+m*2,2),16))}}}while(m--){o=~~(t[m+3]+(t[m]-t[m+3])*s);k.push(o<0?0:o>255?255:o)}return"rgb("+k.join(",")+")"}function b(l){var k=parseFloat(l),j=l.replace(/^[\-\d\.]+/,"");return isNaN(k)?{v:j,f:c,u:""}:{v:k,f:e,u:j}}function d(m){var l,n={},k=g.length,j;h.innerHTML='<div style="'+m+'"></div>';l=h.childNodes[0].style;while(k--){if(j=l[g[k]]){n[g[k]]=b(j)}}return n}a[f]=function(p,m,j){p=typeof p=="string"?document.getElementById(p):p;j=j||{};var r=d(m),q=p.currentStyle?p.currentStyle:getComputedStyle(p,null),l,s={},n=+new Date,k=j.duration||200,u=n+k,o,t=j.easing||function(v){return(-Math.cos(v*Math.PI)/2)+0.5};for(l in r){s[l]=b(q[l])}o=setInterval(function(){var v=+new Date,w=v>u?1:(v-n)/k;for(l in r){p.style[l]=r[l].f(s[l].v,r[l].v,t(w))+r[l].u}if(v>u){clearInterval(o);j.after&&j.after()}},10)}})("emile",this);

// TODO:
// mail/attachment integration

(function(win, doc){
  var video = doc.querySelector('video'),
      snapshots = doc.getElementById('pics'),
      photos = snapshots.getContext('2d'),
      snap = new Image(),
      img = new Image(),
      countdown = new Image(),
      shareimg = new Image(),
      corner = new Image(),
      audio = new Audio('media/click.ogg'),
      button = doc.querySelector('button'),
      container = doc.getElementById('container'),
      VIDEO_WIDTH, VIDEO_HEIGHT, flash,
      form = doc.querySelector('form');
      snaps = [
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 31, 46, 120, 75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 196, 46, 120, 75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 362, 46, 120, 75);},
        function(){photos.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, 527, 46, 120, 75);}
      ];
      
  var canvasPrep = (function(){
    corner.src = 'assets/corner.png';
    snap.src = 'assets/img_border.png';
    snap.onload = function(){
      photos.drawImage(snap, 16, 23);
      photos.drawImage(snap, 181, 23);
      photos.drawImage(snap, 347, 23);
      photos.drawImage(snap, 512, 23);
    }
  }());

  var computeSize = function(supportsObjectFit){
    // user agents that don't support object-fit 
    // will display the video with a different 
    // aspect ratio. 
    if (supportsObjectFit == true){
      VIDEO_WIDTH = 640;
      VIDEO_HEIGHT = 400;
    } else {
      VIDEO_WIDTH = video.videoWidth;
      VIDEO_HEIGHT = video.videoHeight;
    }
  };

  var takeSnaps = function(interval){
    emile(countdown, 'opacity:0', {duration:500, after: function(){
      countdown.parentNode.removeChild(countdown);
      video.play();
    }});
    var i = 0,
    id = setInterval(function(){
      if (snaps.length){
        snaps.shift()();
        showFlash();
        audio.play();
      }
    
      if (++i == 4){
        button.disabled = false;
        clearInterval(id);
        i = 0;
        setTimeout(function(){
          share();
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
    video.addEventListener('loadedmetadata', function(){
      //not all browsers have video@muted yet.
      this.muted = true;
      computeSize();
    }, false);
  };
  
  var startButton = function(){
    countdown.src = 'assets/countdown.svg';
    countdown.id = 'countdown';
    container.appendChild(countdown);
    setTimeout(takeSnaps, 4000, 1200);
  };
  
  var share = function(){
    shareimg.src = 'assets/img_border_hover.png';
    shareimg.onload = function(){
      photos.drawImage(this, 512, 23);
      photos.globalCompositeOperation = 'destination-out';
      photos.drawImage(corner, 635, 23);
      photos.globalCompositeOperation = 'source-over';
    }
    
    snapshots.onclick = function(){
      emile(video, 'opacity: 0', {duration:250, after: function(){
        video.parentNode.removeChild(video);
        //repaint last snapshot w/o share?
        snapshots.className = 'share';
        form.parentNode.className = '';
      }});
      
      repaint();
    };
  };
  
  var repaint = function(){
    shareimg.src = 'assets/img_repaint.png';
    shareimg.onload = function(){
      photos.drawImage(this, 512, 23);
    };
  };
  
  var init = (function(){
    navigator.getUserMedia ? 
      navigator.getUserMedia('video', function(stream){
        video.src = stream;
        video.addEventListener('loadedmetadata', function(){
          video.play();
          computeSize(true);
        }, false);
      }, fallback) : fallback();
  }());
  
  form.onsubmit = function(){
    email = form.querySelector('[type=email]').value,
    xhr = new XMLHttpRequest();
    
    xhr.open('POST', 'email.php');
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
      if (this.status == 200 && this.readyState == 4){
        console.log(this);
      };
    };
    xhr.send('email='+email+'&photo'+snapshots.toDataURL());
    return false;
  };
  
  button.addEventListener('click', function(){
    startButton();
    this.disabled = true;
  }, false);
}(window, document));