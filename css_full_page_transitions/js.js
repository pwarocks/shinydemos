loadHandler = function(e){
	var clen,
	 	clickHandler,
	 	close,
	 	closeHandler,
	 	container,
	 	hasClassList,
	 	i,
	 	len,
	 	loadHandler,
	 	loader,
	 	overlay,
	 	overlayHandler,
	 	secs,
	 	transitionEvent;

	close      = document.querySelectorAll('.close');
	container  = document.querySelector('#container');
	hasClassList = !(document.body.classList == undefined );
	overlay    = document.querySelector('#overlay');
	secs       = document.querySelectorAll('section');

	clen       = close.length;
	len        = secs.length;
	loader	   = document.querySelector('#loader');

	/* Technique borrowed from Modernizr */
	transitionEvent = function(){
		var t, transitions, el = container;

		transitions = {
			'transition':'transitionEnd',
			'OTransition':'oTransitionEnd',
			'MSTransition':'msTransitionEnd',
			'MozTransition':'mozTransitionEnd',
			'WebkitTransition':'webkitTransitionEnd'
		}

		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	}

	clickHandler = function(e){
		e.stopPropagation();

		var trans = transitionEvent();

		if( hasClassList ){
			e.currentTarget.classList.add('leadPhoto');
		} else {
			e.currentTarget.setAttribute('class', e.currentTarget.className +' leadPhoto');
		}

		e.currentTarget.addEventListener(trans, function(e){
			if( document.querySelector('.leadPhoto') != null ){
				hasClassList ? overlay.classList.remove('hide') : overlay.setAttribute('class','');
			} else{}
		}, false);
	}

	closeHandler = function(e){
		e.stopPropagation();

		var lp = document.querySelector('.leadPhoto');
		var re = /leadPhoto/gi;
		var classReplace = 'leadPhoto';

		if( hasClassList == true ){
			overlay.classList.add('hide');
			lp.classList.remove( classReplace );
		} else {
			overlay.setAttribute('class','hide');
			lp.className = lp.className.replace(re,'');
		}
	}

	// add event handler for close buttons.
	for(i = 0; i < len; i++){
		close[i].addEventListener('click', closeHandler, false);
	}

	// add event handler for sections / images.
	for(i = 0; i < clen; i++){
		secs[i].addEventListener('click', clickHandler, false)
	}

	// remove the loading class and hide the loader.
	if( hasClassList ){
		container.classList.remove('loading');
		container.classList.add('loaded');
		loader.classList.add('hide');

	} else {
		container.className = container.className.replace(/loading/,'loaded');
		loader.className    += 'hide';
	}

	overlay.addEventListener('click',closeHandler,false);
}

window.addEventListener('load',loadHandler,false);

