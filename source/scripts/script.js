document.documentElement.id = 'js';
var touch = Modernizr['touch'];

// Index

var indexPage = document.getElementById('page-index'),
	demoPage = document.getElementById('page-demo');

if(indexPage) {
	var indexTitle = document.getElementById('title'),
		indexHeader = indexTitle.parentNode.parentNode;
	if(touch) {
		indexTitle.ontouchstart = function(e) {
			indexPage.classList.toggle('page-index-active');
			e.preventDefault();
		}
	} else {
		indexHeader.onmouseover =
		indexHeader.onmouseout = function(e) {
			indexPage.classList.toggle('page-index-active');
		}
	}
}