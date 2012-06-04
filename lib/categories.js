var yaml = require('js-yaml'),
	config = require('../config.yaml'),
	tags = config[0].tags;

//returns a sister property based on a given tag
exports.getPropFromTag = function(property, tag) {
	var prop;
	
	for (var i = 0, l = tags.length; i < l; i++) {
		if (tags[i].tagName == tag){
			if (tags[i][property] == undefined) {
				throw Error(property + "is not defined");
			} else {
				prop = tags[i][property];
				break;	
			}
		}
	}
	return prop;
}