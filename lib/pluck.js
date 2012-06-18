// creates an array of feature support objects from a string of comma separated
// feature names
// [{slug: "", title: "", link: ""}, ...]

var yaml = require('js-yaml'),
	config = require('../config.yaml'),
	totalFeatures = config[0].features;

var pluckSupport = function(featuresList) {
	var result = [],
		requiredFeatures = featuresList.split(',').map(function(feature){
			return feature.trim();
		});

	for (var i = 0, l = totalFeatures.length; i < l; i++){
		for (var k = 0, m = requiredFeatures.length; k < m; k++) {
			if (totalFeatures[i].slug == requiredFeatures[k]){
				result.push(totalFeatures[i]);
			}
		}
	}
	return result;
}

module.exports = pluckSupport;