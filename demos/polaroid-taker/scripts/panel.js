// 0 for static panel
// 1 for absolute positioned panel
// 2 for fixed positioned panel

var position = 2;

var head = document.getElementsByTagName('head')[0],
	body = document.body,
	options = ['', ' sd-panel-absolute', ' sd-panel-fixed'],
	panel = '<div class="sd-panel' + options[position] + '"><div class="sd-path"><p class="sd-logo"><a href="../index.html" class="sd-logo-link">SD</a></p><div class="sd-dot"></div><h1 class="sd-title">Yet Another Shiny Demo With Catchy Title</h1></div><div class="sd-features sd-features-nope"><p class="sd-desc" id="sd-desc">Your browser doesn’t support all required features</p><ul class="sd-list sd-list-nope"><li class="sd-feature"><a href="" class="sd-feature-link">Geolocation API</a></li><li class="sd-feature"><a href="" class="sd-feature-link">Stream API</a></li><li class="sd-feature"><a href="" class="sd-feature-link">File API</a></li><li class="sd-feature"><a href="" class="sd-feature-link">XMLHttpRequest 2</a></li></ul><p class="sd-desc-sub">Supported</p><ul class="sd-list sd-list-yep"><li class="sd-feature"><a href="" class="sd-feature-link">Media Queries</a></li><li class="sd-feature"><a href="" class="sd-feature-link">CSS Gradients</a></li><li class="sd-feature"><a href="" class="sd-feature-link">HTML5 Video</a></li><li class="sd-feature"><a href="" class="sd-feature-link">DOMTokenList</a></li><li class="sd-feature"><a href="" class="sd-feature-link">SVG</a></li></ul></div></div>';

var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'http://people.opera.com/pepelsbey/experiments/shiny/styles/panel.css';

var script = document.createElement('script');
	script.src = 'http://people.opera.com/pepelsbey/experiments/shiny/scripts/script.js';

document.addEventListener('DOMContentLoaded', function(){
	head.appendChild(link);
	head.appendChild(script);
	body.insertAdjacentHTML('afterbegin', panel);
}, false);