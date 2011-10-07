(function(){

	/*-------------
		using getElementById instead of querySelector in some cases
		so that don't have to retrieve the object once for old
		browsers, and once for new.
	-------------*/

	var	unsupported = document.getElementById('unsupported'),
		overlay     = document.getElementById('overlay'),
	    main        = document.getElementById('main'),
	    borderobj   = main.lastElementChild,
		panels      = document.querySelectorAll('form > fieldset > legend');

	if( Lib.hasBorderRadius == false ){
		overlay.className = 'show';
		unsupported.className = 'show';

	} else {
		var hasRange, form, getcode, range, fixranges, n, close, bgimg, fgimg, fgimg_img, div, unit = 'px';
		var onsubmithandler, onresethandler, onrangechange, onunitchange, onborderchange, onborderwidthchange, oncloseclick, onpanelclick;

		form      = document.querySelector('form');
		getcode   = form.querySelector('button#getcode');
		brdrstyle = document.querySelectorAll('#setborderstyle select');
		range     = document.querySelectorAll('#basic input[type=range]');
		brdrwidth = document.querySelectorAll('#setborderwidth input[type=range]');
		div		  = document.querySelector('#main div');
		bgimg     = document.querySelector('#bgimg');
		fgimg     = document.querySelector('#fgimg');
		fgimg_img = document.createElement('img');
		close     = document.querySelectorAll('.close');

		onrangechange = function(e){
			var prop, u = unit, thisedge, otheredge, labels;
			var linktl, linktr, linkbl, linkbr;

			thisedge = e.target.value + u;

			linktl = document.querySelector('#linktopleft').checked;
			linktr = document.querySelector('#linktopright').checked;
			linkbl = document.querySelector('#linkbottomleft').checked;
			linkbr = document.querySelector('#linkbottomright').checked;

			labels = {'topleftA':'tl',
					  'topleftB':'tl',
					 'toprightA':'tr',
					 'toprightB':'tr',
				  'bottomrightA':'br',
				  'bottomrightB':'br',
				   'bottomleftA':'bl',
				   'bottomleftB':'bl'}

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

			borderobj.style[prop] = thisedge + ' '+otheredge + u;
			document.querySelector( '#'+labels[e.target.id] ).innerHTML = borderobj.style[prop];

			Lib.enableButton('getcode');
			Lib.enableButton('reset');
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

			borderobj.style[whichborder] = e.target.value;
			Lib.enableButton('getcode');
			Lib.enableButton('reset');
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

			/* change the border style to solid so we can see the width change. */
			if( form[whichstyle].value == 'none' ){

				form[whichstyle].value = 'solid';

				/* dispatch a change event to trigger the change */
				evt = document.createEvent('Events');
				evt.initEvent('change',false,false);
				document.getElementById(whichstyle).dispatchEvent(evt);
			}
			borderobj.style[whichborder] = e.target.value + u;
			Lib.enableButton('getcode');
			Lib.enableButton('reset');
		}

		onbgchange = function(e){
			if( e.target.value == ''){
				borderobj.className = '';
			} else {
				borderobj.className = 'patt'+e.target.value;
			}
			Lib.enableButton('getcode');
			Lib.enableButton('reset');
		}

		onfgchange = function(e){
			var img, curchild = main.lastElementChild;

			if( e.target.value == '' ){
				main.replaceChild(div, curchild);
				borderobj = div;
			} else {
				if( curchild == '[object HTMLDivElement]' ){
					img = document.createElement('img');
					main.replaceChild(img, curchild);
				} else {
					img = curchild;
				}
				img.src = e.target.value;
				borderobj = img;
			}
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

			styles   = Lib.getStyles( borderobj );

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

			for(x=0; x < num; x++){
				output += extractCSS( getThese[x], styles );
			}
			pre.innerHTML = output;
			overlay.className = showcss.className = 'show';
			document.body.className = 'killscroll';
		}

		oncloseclick = function(e){
			overlay.className = 'hide';
			showcss.className = 'hide';
			document.body.className = '';
		}

		onpanelclick = function(e){
			e.stopPropagation();
			var transition = Lib.transitionEvent();
			var a = 'active';
			var act = new RegExp(a,'g');
			var parent = e.target.parentNode;
			var panel  = parent.querySelector('div');

			if(Lib.hasClassList){
				parent.classList.toggle(a);
			} else {
				if( parent.className.match(act) ){
					parent.className = parent.className.replace(act,'');
				} else {
					parent.className += ' '+a;
				}
			}
		}

		onresethandler = function(e){
			e.target.reset();
			console.log( e.target );
		}
		/*----------------------
		 Add event handlers
		 ----------------------*/
		Lib.addHandlers({nodelist:range, event:'change', func:onrangechange});
		Lib.addHandlers({nodelist:brdrstyle, event:'change', func:onborderchange});
		Lib.addHandlers({nodelist:brdrwidth, event:'change', func:onborderwidthchange});
		Lib.addHandlers({nodelist:close, event:'click', func:oncloseclick});
		Lib.addHandlers({nodelist:panels, event:'click', func:onpanelclick});
		Lib.addHandlers({nodelist:panels, event:'click', func:onpanelclick});
		Lib.addHandlers({nodelist:panels, event:'click', func:onpanelclick});

		bgimg.addEventListener('change',onbgchange,false);
		fgimg.addEventListener('change',onfgchange,false);
		form.addEventListener('submit',onsubmithandler,false);
		form.addEventListener('reset',onresethandler,false);

}
})();