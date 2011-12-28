document.documentElement.id = 'js';

$(function() {

	$('div.page-index header.header h1').bind('mouseenter focus mouseleave blur', function(){
		$('.navigation').toggleClass('navigation-right');
	});

});