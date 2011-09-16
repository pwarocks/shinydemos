(function(){
	var hasRange, mightBeIE8;

	hasRange = (document.querySelector('input[type=range]').type == 'range');

	// should return true if it is IE8 or older
	mightBeIE8 = ( ('attachEvent' in window ) && !('addEventListener' in window) );

	if( mightBeIE8 ){
		document.getElementById('unsupported').className = '';
		return false;
	} else {

		var main, form, range, fixranges, n, unit = 'px';
		var onsubmithandler, onrangechange, onunitchange, onborderchange, onborderwidthchange, onbgchange;
		var close;

		main      = document.querySelector('#main');
		form      = document.querySelector('form');
		fixranges = document.querySelectorAll('input[type=range]');
		brdrstyle = document.querySelectorAll('#setborderstyle select');
		range     = document.querySelectorAll('#basic input[type=range]');
		brdrwidth = document.querySelectorAll('#setborderwidth input[type=range]');
		bgimg     = document.querySelector('#bgimg');

		close     = document.querySelectorAll('.close');

		onsubmithandler = function(e){ e.preventDefault(); }
		form.addEventListener('submit',onsubmithandler,false);

		/* If we don't have a range, adjust the UI. */
		if( hasRange == false ){
<<<<<<< HEAD

			document.getElementById('worksbestwithrange').className = '';

=======
>>>>>>> working
			var i, len, input;
			len = fixranges.length;
			for(i = 0; i < len; i++){
				fixranges[i].setAttribute('size',4);
				fixranges[i].setAttribute('maxlength',3);
			}
		}

		onrangechange = function(e){
			var prop, u = unit, thisedge, otheredge;
			var linktl, linktr, linkbl, linkbr;

			thisedge = e.target.value + u;

			linktl = document.querySelector('#linktopleft').checked;
			linktr = document.querySelector('#linktopright').checked;
			linkbl = document.querySelector('#linkbottomleft').checked;
			linkbr = document.querySelector('#linkbottomright').checked;


			switch( e.target.id ){
				case 'topleftA':
					prop = 'borderTopLeftRadius';
					otheredge = ( linktl ) ? range[0].value : range[1].value;
					range[1].value = ( linktl ) ? range[0].value : range[1].value;
					document.querySelector('#ttl').innerHTML = thisedge;
					break;
				case 'topleftB':
					prop = 'borderTopLeftRadius';
					otheredge = ( linktl ) ? range[1].value : range[0].value;
					range[0].value = ( linktl ) ? range[1].value : range[0].value;
					document.querySelector('#ltl').innerHTML = thisedge;
					break;
				case 'toprightA':
					prop = 'borderTopRightRadius';
					otheredge = ( linktr ) ? range[2].value : range[3].value;
					range[3].value = ( linktr ) ? range[2].value : range[3].value;
					document.querySelector('#ttr').innerHTML = thisedge;
					break;
				case 'toprightB':
					prop = 'borderTopRightRadius';
					otheredge = ( linktr ) ? range[3].value : range[2].value;
					range[2].value = ( linktr ) ? range[3].value : range[2].value;
					document.querySelector('#rtr').innerHTML = thisedge
					break;
				case 'bottomrightA':
					prop = 'borderBottomRightRadius';
					otheredge = ( linkbr ) ? range[4].value : range[5].value;
					range[5].value = ( linkbr ) ? range[4].value : range[5].value;
					document.querySelector('#bbr').innerHTML = thisedge
					break;
				case 'bottomrightB':
					prop = 'borderBottomRightRadius';
					otheredge = ( linkbr ) ? range[5].value : range[4].value;
					range[4].value = ( linkbr ) ? range[5].value : range[4].value;
					document.querySelector('#rbr').innerHTML = thisedge
					break;
				case 'bottomleftA':
					prop = 'borderBottomLeftRadius';
					otheredge = ( linkbl ) ? range[6].value : range[7].value;
					range[7].value = ( linkbl ) ? range[6].value : range[7].value;
					document.querySelector('#bbl').innerHTML = thisedge
					break;
				case 'bottomleftB':
					prop = 'borderBottomLeftRadius';
					otheredge = ( linkbl ) ? range[7].value : range[6].value;
					range[6].value = ( linkbl ) ? range[7].value : range[6].value;
					document.querySelector('#lbl').innerHTML = thisedge;
					break;
			}

			main.style[prop] = thisedge + ' '+otheredge + unit;
		}

		onborderchange = function(e){
			var whichborder;

			switch( e.target.id ){
				case 'brdrtop':
					whichborder = 'borderTopStyle';
					document.querySelector('#brdrwidthtop').value = 1;
					break;
				case 'brdrright':
					whichborder = 'borderRightStyle';
					document.querySelector('#brdrwidthright').value = 1;
					break;
				case 'brdrbottom':
					whichborder = 'borderBottomStyle';
					document.querySelector('#brdrwidthbottom').value = 1;
					break;
				case 'brdrleft':
					whichborder = 'borderLeftStyle';
					document.querySelector('#brdrwidthleft').value = 1;
					break;
			}

			main.style[whichborder] = e.target.value;
		}

		onborderwidthchange = function(e){
			var whichborder, whichstyle, u = unit, evt;

			switch( e.target.id ){
				case 'brdrwidthtop':
					whichborder = 'borderTopWidth';
					whichstyle  = 'brdrtop';
					break;
				case 'brdrwidthright':
					whichborder = 'borderRightWidth';
					whichstyle  = 'brdrright';
					break;
				case 'brdrwidthbottom':
					whichborder = 'borderBottomWidth';
					whichstyle  = 'brdrbottom';
					break;
				case 'brdrwidthleft':
					whichborder = 'borderLeftWidth';
					whichstyle  = 'brdrleft';
					break;
			}

			// change the border style to solid so we can actually see the width change.
			if( form[whichstyle].value == 'none' ){

				form[whichstyle].value = 'solid';

				// dispatch a change event so that it actually changes
				evt = document.createEvent('Events');
				evt.initEvent('change',false,false);
				document.getElementById(whichstyle).dispatchEvent(evt);
			}
			main.style[whichborder] = e.target.value + u;
		}

		onbgchange = function(e){
			if( e.target.value == ''){
				main.className = '';
			} else {
				main.className = 'patt'+e.target.value;
			}
		}

		/* Set up event handlerst */
		for( n = 0; n < range.length; n++){
			range[n].addEventListener('change', onrangechange, false);
		}

		for( n = 0; n < brdrstyle.length; n++){
			brdrstyle[n].addEventListener('change', onborderchange, false);
		}

		for( n = 0; n < brdrwidth.length; n++){
			brdrwidth[n].addEventListener('change', onborderwidthchange, false);
		}

		for( n = 0; n < close.length; n++){
			close[n].addEventListener('click', function(e){
				e.target.parentNode.parentNode.classList.add('fadeout');
			}, true);
		}

		bgimg.addEventListener('change',onbgchange,false);

	}

})();
