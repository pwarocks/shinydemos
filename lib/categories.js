//returns a sister property based on a given tag
//we need this to get the displayName or tagline
//from a tag

var yaml = require('js-yaml'),
	config = require('../config.yaml'),
	tags = config.tags;

exports.getPropFromTag = function(property, tag) {
	var prop;
	
	for (var i = 0, l = tags.length; i < l; i++) {
		if (tags[i].tagName == tag){
			if (tags[i][property] === undefined) {
				throw Error(property + "is not defined");
			} else {
				prop = tags[i][property];
				break;	
			}
		}
	}
	return prop;
};