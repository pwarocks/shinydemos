var fs = require('fs'),
	filesArray = fs.readdirSync('deploy/thumbs');

var getFileName = function(slug) {
	for (var i = 0, l = filesArray.length; i < l; i++){
		if (match = filesArray[i].match(new RegExp(slug))){
			return match.input;
			break;
		}
	}
}

module.exports = getFileName;