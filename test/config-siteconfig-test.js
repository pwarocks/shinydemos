var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	siteconfig = config.siteconfig;

// the site is designed in such a way that these properties can change
// and it will all just work, but the likelihood is very small--so we're
// testing against hardcoded values for now.

vows.describe('Site config properties').addBatch({
	'The deploy folder': {
		topic: siteconfig.deployFolder,
		'should be "deploy"': function(topic){
			assert.equal(topic, 'deploy');
		}
	},
	'The demos folder': {
		topic: siteconfig.demosFolder,
		'should be "demos"': function(topic){
			assert.equal(topic, 'demos');
		}
	},
	'The source folder': {
		topic: siteconfig.sourceFolder,
		'should be "source"': function(topic){
			assert.equal(topic, 'source');
		}
	},
	'The layouts folder': {
		topic: siteconfig.layoutsFolder,
		'should be "layouts"': function(topic){
			assert.equal(topic, 'layouts');
		}
	}
}).exportTo(module);