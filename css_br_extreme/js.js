(function(){
	/*-------------
		using getElementById instead of querySelector in some cases
		so that don't have to retrieve the object once for old
		browsers, and once for new.
	-------------*/

	var hasBorderRadius,
		unsupported = document.getElementById('unsupported'),
		overlay = document.getElementById('overlay'),
	    main = document.getElementById('main'),
	    getStyles = function( obj ){
			if('getComputedStyle' in window){
				return window.getComputedStyle( obj, null );
			} else {
				return obj.currentStyle;
			}
		};

	/* Is border-radius supported? */
	hasBorderRadius = !( getStyles( main ).borderRadius == undefined );

	if( hasBorderRadius == false ){
		overlay.className = unsupported.className = 'show';
	} else {

		var hasRange, form, button, range, fixranges, n, close, unit = 'px';
		var onsubmithandler, onrangechange, onunitchange, onborderchange, onborderwidthchange;

		hasRange = (document.querySelector('input[type=range]').type == 'range');

		form      = document.querySelector('form');
		button    = form.querySelector('button');
		brdrstyle = document.querySelectorAll('#setborderstyle select');
		range     = document.querySelectorAll('#basic input[type=range]');
		brdrwidth = document.querySelectorAll('#setborderwidth input[type=range]');
		bgimg     = document.querySelector('#bgimg');

		close     = document.querySelectorAll('.close');

		/* If we don't have a range, adjust the UI. */
		if( hasRange == false ){
			var i, len, input;
			fixranges = document.querySelectorAll('input[type=range]');
			len = fixranges.length;
			for(i = 0; i < len; i++){
				fixranges[i].setAttribute('size',4);
				fixranges[i].setAttribute('maxlength',3);
			}
		}


		/*----------------------
		 Define event handlers
		 ----------------------*/

		onrangechange = function(e){
			var prop, u = unit, thisedge, otheredge;
			var linktl, linktr, linkbl, linkbr;

			thisedge = e.target.value + u;

			linktl = document.querySelector('#linktopleft').checked;
			linktr = document.querySelector('#linktopright').checked;
			linkbl = document.querySelector('#linkbottomleft').checked;
			linkbr = document.querySelector('#linkbottomright').checked;

			var labels = {	'topleftA':'tl',
							'topleftB':'tl',
							'toprightA':'tr',
							'toprightB':'tr',
							'bottomrightA':'br',
							'bottomrightB':'br',
							'bottomleftA':'bl',
							'bottomleftB':'bl' }


			switch( e.target.id ){
				case 'topleftA':
					prop = 'borderTopLeftRadius';
					otheredge = ( linktl ) ? range[0].value : range[1].value;
					range[1].value = ( linktl ) ? range[0].value : range[1].value;
					break;
				case 'topleftB':
					prop = 'borderTopLeftRadius';
					otheredge = ( linktl ) ? range[1].value : range[0].value;
					range[0].value = ( linktl ) ? range[1].value : range[0].value;
					break;
				case 'toprightA':
					prop = 'borderTopRightRadius';
					otheredge = ( linktr ) ? range[2].value : range[3].value;
					range[3].value = ( linktr ) ? range[2].value : range[3].value;
					break;
				case 'toprightB':
					prop = 'borderTopRightRadius';
					otheredge = ( linktr ) ? range[3].value : range[2].value;
					range[2].value = ( linktr ) ? range[3].value : range[2].value;
					break;
				case 'bottomrightA':
					prop = 'borderBottomRightRadius';
					otheredge = ( linkbr ) ? range[4].value : range[5].value;
					range[5].value = ( linkbr ) ? range[4].value : range[5].value;
					break;
				case 'bottomrightB':
					prop = 'borderBottomRightRadius';
					otheredge = ( linkbr ) ? range[5].value : range[4].value;
					range[4].value = ( linkbr ) ? range[5].value : range[4].value;
					break;
				case 'bottomleftA':
					prop = 'borderBottomLeftRadius';
					otheredge = ( linkbl ) ? range[6].value : range[7].value;
					range[7].value = ( linkbl ) ? range[6].value : range[7].value;
					break;
				case 'bottomleftB':
					prop = 'borderBottomLeftRadius';
					otheredge = ( linkbl ) ? range[7].value : range[6].value;
					range[6].value = ( linkbl ) ? range[7].value : range[6].value;
					break;
			}

			main.style[prop] = thisedge + ' '+otheredge + u;
			document.querySelector( '#'+labels[e.target.id] ).innerHTML = main.style[prop];
			if( button.disabled ){ button.removeAttribute('disabled') };
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
			if( button.disabled ){ button.removeAttribute('disabled') };
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
			if( button.disabled ){ button.removeAttribute('disabled') };
		}

		onbgchange = function(e){
			if( e.target.value == ''){
				main.className = '';
			} else {
				main.className = 'patt'+e.target.value;
			}
			if( button.disabled ){ button.removeAttribute('disabled') };
		}

		onsubmithandler = function(e){
			e.preventDefault();

			var	x,
				num,
				extractCSS,
				getThese,
				output,
				showcss,
				pre,
				styles;

			showcss  = document.querySelector('#showcss');
			pre      = document.querySelector('pre');

			styles   = getStyles( main );

			output = '';

			extractCSS = function( arrayOfStyles, styleObj){
				var i, val, out, len = arrayOfStyles.length, css = new Array();

				for( var i = 0; i < len; i++){
					val = styleObj.getPropertyValue(arrayOfStyles[i]);

					if( (val != '0px') && (val != 'none') ){
						css.push( arrayOfStyles[i]+': '+ val +';' );
					}
				}

				if( css.length > 0 ){
					css.push(''); /* pad the array by 1 for formatting reasons */
					out = css.join('\n'); /* turn array into a string */
				} else {
					out = '';
				}
				return out;
			}


			getThese = [
			  ['background-image','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius','border-top-left-radius'],
			  ['border-top-style','border-right-style','border-bottom-style','border-left-style'],
			  ['border-top-width','border-right-width','border-bottom-width','border-left-width']
			];

			num = getThese.length;

			/* possible regex for matching the unlinked corner values.
					\d*px\s\d*px */

			for(x=0; x < num; x++){
				output += extractCSS( getThese[x], styles );
			}
			pre.innerHTML = output;
			overlay.className = showcss.className = 'show';
			document.body.className = 'killscroll';
		}



		/*----------------------
		 Add event handlers
		 ----------------------*/
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
				overlay.className = 'hide';
				showcss.className = 'hide';
				document.body.className = '';
			}, true);
		}

		bgimg.addEventListener('change',onbgchange,false);
		form.addEventListener('submit',onsubmithandler,false);


   }
})();

