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
	 	overlay,
	 	overlayHandler,
	 	secs,
	 	transitionEvent;

	clen       = close.length;
	close      = document.querySelectorAll('.close');
	container  = document.querySelector('#container');
	hasClassList = !(document.body.classList == undefined );
	len        = secs.length;
	overlay    = document.querySelector('#overlay');
	secs       = document.querySelectorAll('section');

	/* Yeah yeah, it's a browser sniff. Sorry. */
	transitionEvent = function(){
		var whichTrans;
		if( !window.opera ){
			switch( navigator.userAgent.match(/webkit|gecko|trident/i)[0].toLowerCase() ){
				case 'webkit':
					whichTrans = 'webkitTransitionEnd';
					break;
				case 'gecko':
					whichTrans = 'mozTransitionEnd';
					break;
				case 'trident':
					whichTrans = 'msTransitionEnd';
					break;
			}
		} else{
			whichTrans = 'oTransitionEnd';
		}
		return whichTrans;
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

		var lp = e.currentTarget.parentNode;
		var re = /leadPhoto/gi;
		var classReplace = 'leadPhoto';

		if(hasClassList == true){
			overlay.classList.add('hide');
			lp.classList.remove(classReplace);

		} else {
			overlay.setAttribute('class','hide');
			lp.setAttribute('class', lp.className.replace(re,'') );
		}
	}

	for(i = 0; i < len; i++){
		close[i].addEventListener('click', closeHandler, false);
	}
	for(i = 0; i < clen; i++){
		secs[i].addEventListener('click', clickHandler, false)
	}
	if( hasClassList ){
		container.classList.remove('loading');
		container.classList.add('loaded');
	} else {
		container.setAttribute('class',container.className.replace(/loading/,'loaded') );
	}
	overlay.addEventListener('click',closeHandler,false);
}

window.addEventListener('load',loadHandler,false);
