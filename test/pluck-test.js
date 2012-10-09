var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	pluckSupport = require('../lib/pluck');

//TODO: consider fixtures in case config.yml copy changes
//NOTE: not testing the `pluckSupport()` (no args) case because tests in
//config-demos-test.js should catch that first

vows.describe('Feature support "plucking"').addBatch({
	'The options.js feature object': {
		'with one feature': {
			topic: pluckSupport('canvas'),
			'returns an array': function(topic){
				assert.isArray(topic);
			},
			'returns an object in the array': function(topic){
				assert.isObject(topic[0]);
			},
			'returns an object with 3 keys in the array': function(topic){
				assert.equal(Object.keys(topic[0]).length, 3);
			}
		},
		'with two features': {
			topic: pluckSupport('canvas, borderradius'),
			'returns an array': function(topic){
				assert.isArray(topic);
			},
			'returns an array with two items': function(topic){
				assert.equal(topic.length, 2);
			},
			'returns two object with 3 keys each in the array': function(topic){
				assert.equal(Object.keys(topic[0]).length + Object.keys(topic[0]).length, 6);
			}
		}
	}
}).exportTo(module);