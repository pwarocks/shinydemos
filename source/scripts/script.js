document.documentElement.id = 'js';
var touch = 'ontouchstart' in window;

function toggleClass(el, name) {
	var state = el.className,
		stateName = name;
	el.className = (state.indexOf(stateName)+1) ?
		state.replace(' ' + stateName, '') :
		state += ' ' + stateName;
}

// Index

var indexPage = document.getElementById('page-index');

if(indexPage) {
	var indexTitle = document.getElementById('title'),
		indexHeader = indexTitle.parentNode.parentNode;
	if(touch) {
		indexTitle.ontouchstart = function(e) {
			toggleClass(indexPage, 'page-index-active');
			e.preventDefault();
		}
	} else {
		indexHeader.onmouseover =
		indexHeader.onmouseout = function(e) {
			toggleClass(indexPage, 'page-index-active');
		}
	}
}

// Demo

var panelDescription = document.getElementById('sd-desc');

if(panelDescription) {
	var panelFeatures = panelDescription.parentNode;
	if(touch) {
		panelDescription.ontouchstart = function(e) {
			toggleClass(panelFeatures, 'sd-features-active');
			e.preventDefault();
		}
	} else {
		panelFeatures.onmouseover =
		panelFeatures.onmouseout = function(e) {
			toggleClass(panelFeatures, 'sd-features-active');
		}
	}
}