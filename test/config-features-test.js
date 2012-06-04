var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	features = config[0].features;

// features:
// - slug: applicationcache
//   title: 'App Cache'
//   link: 'http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html'

vows.describe('Demo feature properties').addBatch({
	'A slug': {
		topic: features[0].slug,
		'should be lowercase (numbers OK)': function(topic){
			assert.match(topic, /^[a-z0-9]+$/);
		},
		'should not be undefined': function(topic){
			assert.isDefined(topic);	
		},
		'should not contain spaces': function(topic){
			assert.match(topic, /^[^\s]+$/)
		}
	}
}).addBatch({
	'A title': {
		topic: features[0].title,
		'should be a string': function(topic){
			assert.isString(topic);
		},
		'should not be empty': function(topic){
			assert.isNotEmpty(topic);
		},
		'should not be undefined': function(topic){
			assert.isDefined(topic);	
		}
	}
}).addBatch({
	'A link': {
		topic: features[0].link,
		'should be a string': function(topic){
			assert.isString(topic);
		},
		'should not be empty': function(topic){
			assert.isNotEmpty(topic);
		},
		'should not be undefined': function(topic){
			assert.isDefined(topic);	
		},
		'should smell like a hyperlink': function(topic){
			assert.match(topic, /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/i);
		}
	}
}).export(module);