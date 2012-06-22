// each demo needs to have a thumbnail image (that appears on a tag page)
// this module allows us to use any file extension, so long as the filename
// matches the demo's slug: e.g., demos/clock/ has a corresponding image at
// source/thumbs/clock.png|gif|jpg

var getFileName = function(filesArray, slug) {
	for (var i = 0, l = filesArray.length; i < l; i++){
		if (match = filesArray[i].match(new RegExp("^" + slug + "\\."))){
			return match.input;
		}
	}
};

module.exports = getFileName;