//This will likely break if the structure of odin or emberwind changes.
//Anytime we need to update the submodules, we should test to see if the 
//patch can apply cleanly. Yay!

//Obviously this requires you have the shinydemos-misc repo in the right 
//place with the correct patches as well.

// used like: patch(['emberwind', 'odin'])

var exec = require('child_process').exec;
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	deployFolder = config[0].siteconfig.deployFolder,
	deployRoot = config[0].siteconfig.deployRoot;

var patch = function(demos) {
	demos.forEach(function(demo){
		exec('patch ' + deployFolder + '/' + demo+ '/index.html ' + deployRoot + '/' + demo + '.patch', 
			function (error, stdout, stderr) {
				console.log('Patching index.html for ' + demo);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
		});	
	})
};

module.exports = patch;