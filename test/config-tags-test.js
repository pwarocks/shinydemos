var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	tags = config[0].tags;

// how can i test every single item?
// for (var i = 0; i < tags.length; i++){ ?

vows.describe('Demo tags').addBatch({
	'A tagName': {
		topic: tags[0].tagName,
		'should be a string': function(topic){
			assert.isString(topic);
		},
		'should be lowercase (numbers OK)': function(topic){
			assert.match(topic, /^[a-z0-9]+$/);
		},
		'should not be undefined': function(topic){
			assert.isDefined(topic);	
		},
		'should not contain spaces': function(topic){
			assert.match(topic, /^[^\s]+$/);
		}
	}
}).addBatch({
	'A displayName': {
		topic: tags[0].displayName,
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
	'A tagline': {
		topic: tags[0].tagline,
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
}).export(module);