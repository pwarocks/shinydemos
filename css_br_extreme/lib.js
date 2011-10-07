var Lib = function(){
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

		/* Enable or disable a button */
		enableButton: function(buttonid){
			var button = document.querySelector('button#'+buttonid);
			if(button.disabled){ button.removeAttribute('disabled'); }
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
		}
	// end object
	}
}
var Lib = Lib();
