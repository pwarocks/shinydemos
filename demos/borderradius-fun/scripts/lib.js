var Lib = (function(){
	return {
		hasClassList: !(document.body.classList === undefined ),
		hasBorderRadius: !(document.createElement('fauxel').style.borderRadius === undefined),
		getStyles: function( obj ){
			if('getComputedStyle' in window){
				return window.getComputedStyle( obj, null );
			} else {
				return obj.currentStyle;
			}
		},

		/* Which transition event? */
		transitionEvent: function(){
			var t, transitions, el = document.createElement('fakeEl');
			transitions = {
			'OTransition':'oTransitionEnd',
			'MSTransition':'msTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd',
			'transition':'transitionEnd'
		}
			for(t in transitions){
				if( el.style[t] !== undefined ){
					return transitions[t];
				}
			}
		},

	 	/* Does this browser support range? */
	    hasRange: function(){
	       	var input = document.createElement('input');
	       	input.setAttribute('type','range');
	       	return (input.type == 'range')
	    },

		/* Enable a button */
		enableButton: function(buttonid){
			var button = document.querySelector('button#'+buttonid);
			if(button.disabled){ button.removeAttribute('disabled'); }
		},
		/* Disable a button */
		disableButton: function(buttonid){
			var button = document.querySelector('button#'+buttonid);
			button.setAttribute('disabled','disabled');
		},

		/* If we don't have a range, adjust the UI. */
		adjustUI: function(){
		 	var hasRange = this.hasRange();
			if( hasRange === false ){
				var i, len, input;
				fixranges = document.querySelectorAll('input[type=range]');
				len = fixranges.length;
				for(i = 0; i < len; i++){
					fixranges[i].setAttribute('size',4);
					fixranges[i].setAttribute('maxlength',3);
					fixranges[i].className = 'notrange';
				}
			}
		},
		addHandlers: function(obj){
			var n, len, usecapture;
			len = obj.nodelist.length;

			(obj.capture === undefined) ? usecapture = false : usecapture = obj.capture;

			for(n = 0; n < len; n++){
				obj.nodelist[n].addEventListener(obj.event, obj.func, obj.capture);
			}
		},
		makeVideo: function(filename){
			var canplay, video = document.createElement('video');
			var t, restart, types = {
				'.ogg':'video/ogg',
				'.webm':'video/webm',
				'.mp4':'video/mp4'
			}
			restart = function(e){
				 e.target.play();
			}


			for(t in types){
				switch( video.canPlayType( types[t] ) ){
					case 'maybe':
					case 'probably':
						canplay = t;
						break;
				}
			}
			video.src = 'http://media.shinydemos.com/borderradius-fun/'+filename+canplay;
			video.width = '100%';
			video.height = '100%';
			video.setAttribute('autoplay','autoplay');
			video.setAttribute('loop','loop');
			video.addEventListener('ended', restart);
			return video;
		},
		makeImage: function(filename){
			var img = document.createElement('img');
			img.src = filename;
			return img;

		},
		/*
		   Yes, we are browser sniffing. This is generally a bad
		   practice. However it is the best choice in this SPECIFIC
		   case because:

		   1. We are testing for a known browser bug in a known entity
		   (a released browser).

		   2. It will have minimal side effects in future versions
		   of this browser.

		   3. There is no other fix.
		*/

		mightBeAndroid: function(){
            if( window.navigator.vendor === undefined){
                return false;
            } else {
                if(
                    (window.navigator.vendor.indexOf('Google') > -1) &&
                    (window.navigator.platform == 'Linux armv7l')
                ){
                    return true;
                } else {
                    return false;
                }
            }
		}
	// end object
	}
})();

