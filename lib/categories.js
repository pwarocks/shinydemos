exports.tagline = function(categories, tag) {
	var tagline;
	
	for (var i = 0, l = categories.length; i < l; i++){
		if (categories[i].tagName == tag){
			tagline = categories[i].tagline;
			break;
		}
	}
	return tagline;
}

exports.displayName = function(categories, tag) {
	var displayName;
	
	for (var i = 0, l = categories.length; i < l; i++){
		if (categories[i].tagName == tag){
			displayName = categories[i].displayName;
			break;
		}
	}
	return displayName;
}