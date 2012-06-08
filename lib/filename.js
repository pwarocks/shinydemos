var getFileName = function(filesArray, slug) {
	for (var i = 0, l = filesArray.length; i < l; i++){
		if (match = filesArray[i].match(new RegExp("^" + slug + "\\."))){
			return match.input;
			break;
		}
	}
}

module.exports = getFileName;