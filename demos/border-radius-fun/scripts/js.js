(function(){

	/*-------------
		using getElementById instead of querySelector in some cases
		so that don't have to retrieve the object once for old
		browsers, and once for new.
	-------------*/

	var	unsupported = document.getElementById('unsupported'),
		overlay     = document.getElementById('overlay'),
		showcss     = document.getElementById('showcss'),
		main        = document.getElementById('main'),
		borderobj   = main.lastElementChild,
		panels      = document.querySelectorAll('form > fieldset > legend'),
		close       = document.querySelectorAll('.close'),
		oncloseclick;

        oncloseclick = function(e){
            e.preventDefault();

            // hides either the unsupported or get the css panel.
            e.currentTarget.parentNode.className = 'hide';

            // hides the overlay.
            e.currentTarget.parentNode.parentNode.className = 'hide';

            document.body.className = '';
        };

	    Lib.addHandlers({nodelist:close, event:'click', func:oncloseclick});


	if( Lib.hasBorderRadius === false ){
		overlay.className = 'show';
		unsupported.className = 'show';

	} else {

        var hasRange,
            form,
            getcode,
            range,
            fixranges,
            n,
            bgimg,
            fgimg,
            fimg,
            div,
            unit = 'px';

		var onsubmithandler,
		    onresethandler,
		    onrangechange,
		    onborderchange,
		    onborderwidthchange,
		    onpanelclick;

		form      = document.querySelector('form');
		getcode   = form.querySelector('button#getcode');
		brdrstyle = document.querySelectorAll('#setborderstyle select');
		range     = document.querySelectorAll('#basic input[type=range]');
		brdrwidth = document.querySelectorAll('#setborderwidth input[type=range]');
		div       = document.querySelector('#main div');
		bgimg     = form['bgimg'];
		fgimg     = form['fgimg'];
		img       = Lib.makeImage('images/kananaskis.jpg');
		vid       = Lib.makeVideo('raindropsinapool');

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
				   'bottomleftB':'bl'};

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
			Lib.enableButton('resetform');
		};

		onborderchange = function(e){
			var whichborder;

			switch( e.target.id ){
				case 'brdrtop':
					whichborder = 'borderTopStyle';
					document.querySelector('#brdrwidthtop').value = (document.querySelector('#brdrwidthtop').value > 0) ? document.querySelector('#brdrwidthtop').value : 1;
					break;
				case 'brdrright':
					whichborder = 'borderRightStyle';
					document.querySelector('#brdrwidthright').value = (document.querySelector('#brdrwidthright').value > 0) ? document.querySelector('#brdrwidthright').value : 1;
					break;
				case 'brdrbottom':
					whichborder = 'borderBottomStyle';
					document.querySelector('#brdrwidthbottom').value = (document.querySelector('#brdrwidthbottom').value > 0) ? document.querySelector('#brdrwidthbottom').value : 1;
					break;
				case 'brdrleft':
					whichborder = 'borderLeftStyle';
					document.querySelector('#brdrwidthleft').value = (document.querySelector('#brdrwidthleft').value > 0) ? document.querySelector('#brdrwidthleft').value : 1;
					break;
			}

			borderobj.style[whichborder] = e.target.value;
			Lib.enableButton('getcode');
			Lib.enableButton('resetform');
		};

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
			if( form[whichstyle].value === '' ){

				form[whichstyle].value = 'solid';

				/* dispatch a change event to trigger the change */
				evt = document.createEvent('Event');
				evt.initEvent('change',false,false);
				document.getElementById(whichstyle).dispatchEvent(evt);
			}
			borderobj.style[whichborder] = e.target.value + u;
			Lib.enableButton('getcode');
			Lib.enableButton('resetform');
		};

		onbgchange = function(e){
			if( e.target.value === ''){
				borderobj.className = '';
			} else {
				borderobj.className = 'patt'+e.target.value;
			}
			Lib.enableButton('getcode');
			Lib.enableButton('resetform');
		};

		onfgchange = function(e){

			var curchild = main.lastElementChild, selects = document.querySelectorAll('select');

			var whichtype = e.currentTarget.value;

			switch( whichtype ){
				case 'div':
					borderobj = div;
					break;
				case 'video':
					borderobj = vid;
					vid.play();
					break;
				case 'img':
					borderobj = img;
					break;
			}
			borderobj.id = curchild.id;

			main.replaceChild(borderobj, curchild);

			/* Reset the form. */
			form.setAttribute('class','formonly');
			form.reset();

			/*******
			  Set fgimg value to current type of object
			  so the field stays the same.
			********/

			form[whichtype].checked = true;

			/* Remove any classes from the border object */
			borderobj.className = '';

			/* Reset styles on all of these objects */
			img.style.cssText = '';
			vid.style.cssText = '';
			div.style.cssText = '';
		};

		onsubmithandler = function(e){
			e.preventDefault();

			var	x,
				num,
				extractCSS,
				getThese,
				output,
				pre,
				styles;

			pre      = document.querySelector('pre');

			styles   = Lib.getStyles( borderobj );

			output = '';

			extractCSS = function( arrayOfStyles, styleObj){
				var i, val, out, len = arrayOfStyles.length, css = [];

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
			};

			getThese = [
			  ['background-image','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius','border-top-left-radius'],
			  ['border-top-style','border-right-style','border-bottom-style','border-left-style'],
			  ['border-top-width','border-right-width','border-bottom-width','border-left-width']
			];

			num = getThese.length;

			for(x=0; x < num; x++){
				output += extractCSS( getThese[x], styles );
			}

			if( output === ''){
				output = 'No styles to output.';
			}

			pre.innerHTML = output;
			overlay.className = showcss.className = 'show';

	};

		onpanelclick = function(e){
			e.stopPropagation();
			var transition = Lib.transitionEvent();
			var a = 'active';
			var act = new RegExp(a,'g');
			var parent = e.currentTarget.parentNode;
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
		};

		onresethandler = function(e){

			var i, hasclass, curchild, corners = document.querySelectorAll('.crnrsz'), clen = corners.length;
			/*
			 If form has a class of 'formonly', the event came from onfgchange,
			 and we only want to change the form values.

			 Otherwise we also want to reset the borderobj.
			*/

			Lib.hasClassList ? (hasclass = form.classList.contains('formonly') ) : (hasclass = form.className.indexOf('formonly') !== -1);

			if( !hasclass ){

				/* Get the current last child */
				curchild = main.lastElementChild;

				div.id = curchild.id;

				borderobj = div;

				/* Remove any classes from the object */
				borderobj.setAttribute('class','');

				/* Swap a <div> with the lastElementChild */
				main.replaceChild(borderobj, curchild);

				/* Reset styles and class on all of these objects */
				img.style.cssText = vid.style.cssText = div.style.cssText = '';
			}

			/* Reset the corners so that they all say 0px */
			for(i = 0; i < clen; i++){
				corners[i].innerHTML = '0px';
			}

			/* Disable buttons again since we have reset. */
			Lib.disableButton('getcode');
			Lib.disableButton('resetform');

			/* Remove any classes from the form */
			form.setAttribute('class','');
		};

		/* Adjust UI for browsers without a range UI */
		Lib.adjustUI();

		/*----------------------
		 Add event handlers
		 ----------------------*/
		Lib.addHandlers({nodelist:range, event:'change', func:onrangechange});
		Lib.addHandlers({nodelist:brdrstyle, event:'change', func:onborderchange});
		Lib.addHandlers({nodelist:brdrwidth, event:'change', func:onborderwidthchange});
		Lib.addHandlers({nodelist:panels, event:'click', func:onpanelclick});
		Lib.addHandlers({nodelist:bgimg, event:'click', func:onbgchange});
		Lib.addHandlers({nodelist:fgimg, event:'click', func:onfgchange});

		form.addEventListener('submit',onsubmithandler,false);
		form.addEventListener('reset',onresethandler,false);

        /* Add 'android' class to the body if it looks like this is Android. */

        if( Lib.mightBeAndroid() ){
            document.body.className += ' norangeui';
        }
	}

})();