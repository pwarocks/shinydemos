// Microjungle DOM Builder — github.com/deepsweet/microjungle

var microjungle=function(e){function f(h,b){for(var e=h.length,g=0;g<e;g++){var a=h[g];if(a)if(typeof a=='string')b.innerHTML+=a;else if(typeof a[0]=='string'){var j=i.createElement(a.shift()),c={}.toString.call(a[0])==='[object Object]'&&a.shift(),d;if(c)for(d in c)c[d]&&j.setAttribute(d,c[d]);b.appendChild(f(a,j));}else a.nodeType===11?b.appendChild(a):f(a,b);}return b;}var i=document;return f(e,i.createDocumentFragment());};

// Panel Constructor

function appendPanel(options) {

	var body = document.body,
		panel = document.createElement('div'),
		button = document.createElement('button'),
		yepList = [], nopeList = [],
		maybeFeatures = options.features.slice(0, options.features.length - 1),
		nopeFeatures = [], yepFeatures = [],
		nopeDesc = 'Your browser doesn&rsquo;t support all required features',
		yepDesc = 'Success! Your browser supports all required features!';

	for(var i=0, l=maybeFeatures.length; i<l; i++) {
		var feature = maybeFeatures[i];
		if(Modernizr[feature.name]) {
			yepFeatures.push(feature);
		} else {
			nopeFeatures.push(feature);
		}
	}

	var tags = ['p', {'class': 'sd-tags'}];

	for(var i=0, l=options.tags.length; i<l; i++) {
		var tag = options.tags[i];
		tags.push(['a', {'href': '/'+ tag + '/'}, tag]);
	}

	var nopes = nopeFeatures.length,
		yeps = yepFeatures.length;

	function createFeatures(features, list) {
		for(var i=0, l=features.length; i<l; i++) {
			var feature = features[i];
			list.push(['li',
				['a', {'href': feature.link}, feature.title]
			]);
		}
	}

	if(nopes) {
		nopeList = ['ul', {'class': 'sd-list sd-list-nope'}];
		createFeatures(nopeFeatures, nopeList);
		panel.classList.add('sd-panel-on');
	}

	if(yeps) {
		yepList = ['ul', {'class': 'sd-list sd-list-yep'}];
		createFeatures(yepFeatures, yepList);
	}

	var desc = nopes ? nopeDesc : yepDesc,
		descName = nopes ? 'sd-features-nope' : 'sd-features-yep';

	var content = microjungle([
		['div', {'class': 'sd-description'},
			['div', {'class': 'sd-title'},
				['p',
					['a', {'href': '/'}, 'SD']
				],
				['h1', options.title]
			],
			['p', {'class': 'sd-legend'}, options.legend],
			tags
		],
		['div', {'class': 'sd-features ' + descName},
			['p', desc],
			nopeList,
			yepList
		]
	]);

	panel.classList.add('sd-panel');

	button.classList.add('sd-button');
	button.addEventListener('click', function(){
		panel.classList.toggle('sd-panel-on');
	}, false);

	panel.appendChild(content);
	panel.appendChild(button);
	body.appendChild(panel);

}

// Google Analytics

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-17110734-4']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();