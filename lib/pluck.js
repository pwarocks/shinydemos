var pluckSupport = function(totalFeatures, featuresList) {
	var result = [],
			requiredFeatures = featuresList.split(',').map(function(feature){
				return feature;
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