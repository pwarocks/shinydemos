document.documentElement.id = 'js';
var touch = Modernizr['touch'];

// Index

var indexPage = document.getElementById('page-index');

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

// Features

function checkFeatures(list) {

	var panelFeatures = document.getElementById('sd-features'),
		panelDescription = document.getElementById('sd-desc'),
		panelSupport = 'sd-features-yep';

	var maybeFeatures = list.split(','), nopeFeatures = [], yepFeatures = [],
		nopeDescription = 'Your browser doesn’t support all required features',
		yepDescription = 'Success! Your browser supports all required features!',
		descriptionText = yepDescription;

	for(var i=0, l=maybeFeatures.length; i<l; i++) {
		var feature = maybeFeatures[i];
		if(Modernizr[feature]) {
			yepFeatures.push(feature);
		} else {
			nopeFeatures.push(feature);
		}
	}

	var description = document.createElement('p'),
		descriptionText;
		description.className = description.id = 'sd-desc';

	var features = document.createElement('ul');
		features.className = 'sd-list';

	panelFeatures.appendChild(description);

	var nopes = nopeFeatures.length,
		yeps = yepFeatures.length;

	function createFeatures(listFeatures) {
		var list = features.cloneNode(false)
		for(var i=0, l=listFeatures.length; i<l; i++) {
			var item = document.createElement('li'),
				link = document.createElement('a'),
				text = document.createTextNode(listFeatures[i]);

			item.className = 'sd-feature';
			link.className = 'sd-feature-link';
			link.href = 'http://caniuse.com/#search=' + encodeURI(listFeatures[i]);
			link.target = '_blank';

			link.appendChild(text);
			item.appendChild(link);
			list.appendChild(item);
		}
		return list;
	}

	if(nopes) {
		var nopeList = createFeatures(nopeFeatures);
			nopeList.classList.add('sd-list-nope');

		descriptionText = nopeDescription;
		panelSupport = 'sd-features-nope';
		panelFeatures.appendChild(nopeList);
	}

	if(nopes && yeps) {
		var subtitle = document.createElement('p'),
			subtitleText = document.createTextNode('Supported');
			subtitle.className = 'sd-desc-sub';
			subtitle.appendChild(subtitleText);

		panelFeatures.appendChild(subtitle);
	}

	if(yeps) {
		var yepList = createFeatures(yepFeatures);
			yepList.classList.add('sd-list-yep');

		panelFeatures.appendChild(yepList);
	}

	descriptionText = document.createTextNode(descriptionText);
	description.appendChild(descriptionText);
	panelFeatures.classList.add(panelSupport);

	if(touch) {
		panelDescription.ontouchstart = function(e) {
			panelFeatures.classList.toggle('sd-features-active');
			e.preventDefault();
		}
	} else {
		panelFeatures.onmouseover =
		panelFeatures.onmouseout = function(e) {
			panelFeatures.classList.toggle('sd-features-active');
		}
	}
}