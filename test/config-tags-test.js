var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	tags = config[0].tags;

for (var i = 0, tag; tag = tags[i]; i++) {
	vows.describe('Demo tags').addBatch({
		'A tagName': {
			topic: tag.tagName,
			'should be a string': function(topic){
				assert.isString(topic);
			},
			'should be lowercase (numbers OK)': function(topic){
				assert.match(topic, /^[a-z0-9\-]+$/);
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
			topic: tag.displayName,
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
			topic: tag.tagline,
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
}