var	extractCSS,
	getThese,
	output,
	overlay,
	pre,
	styles;

overlay  = document.querySelector('#overlay');
closeBtn = document.querySelector('#overlay a');
pre      = document.querySelector('pre');

styles = window.getComputedStyle(main, null);

output = '';

extractCSS = function( arrayOfStyles, styleObj){
	var i, len = arrayOfStyles.length, css = new Array();

	for( var i = 0; i < len; i++){
		css[i] = arrayOfStyles[i]+': '+styleObj.getPropertyValue(arrayOfStyles[i]);
	}
	return css.join('\n');
}

document.forms[0].addEventListener('submit',function(e){
	e.preventDefault();

	getThese = [
		'background-image',
		'border-top-right-radius',
		'border-bottom-right-radius',
		'border-bottom-left-radius',
		'border-top-left-radius',
		'border-top-style',
		'border-right-style',
		'border-bottom-style',
		'border-left-style',
		'border-top-width',
		'border-right-width',
		'border-bottom-width',
		'border-left-width'
	]

	pre.innerHTML = extractCSS( getThese, styles );

	overlay.className = '';
	document.body.className = 'killscroll';
}, false);
