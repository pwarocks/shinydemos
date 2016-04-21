require('require-yaml');

var vows = require('vows'),
	assert = require('assert'),
	config = require('../config.yaml'),
	demos = config.demos;

// - slug: beach
// title: 'Beach'
// legend: 'Wake up to the sound of waves breaking on shore. Press the button to open up your CSS gradient blinds, and see your room transition from dark to light. The beach is deserted, so why not try {swimsuit: none} ?'
// tags: [css3]
// support: [csstransitions, cssgradients]

for (var i = 0, demo; demo = demos[i]; i++) {
	vows.describe('Demo properties').addBatch({
		'A slug': {
			topic: demo.slug,
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
		'A title': {
			topic: demo.title,
			'should be a string': function(topic){
				assert.isString(topic);
			},
			'should not be empty': function(topic){
				assert.isNotEmpty(topic);
			},
			'should not be undefined': function(topic){
				assert.isDefined(topic);
			},
			'should use Sentence Case': function(topic){
				assert.notEqual(topic[0], function(topic){
					//it could start with a number, and we don't want toLowerCase() that
					if (typeof topic[0] != 'string'){
						return "ಠ_ಠ";
					} else {
						return topic[0].toLowerCase();
					}
				});
			}
		}
	}).addBatch({
		'A legend': {
			topic: demo.legend,
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
		'The tags': {
			topic: demo.tags,
			'should be an array': function(topic){
				assert.isArray(topic);
			},
			'should not be empty': function(topic){
				assert.isNotEmpty(topic);
			},
			'should not be undefined': function(topic){
				assert.isDefined(topic);
			}
		}
	}).addBatch({
		'The support': {
			topic: demo.support,
			'should be an array': function(topic){
				assert.isArray(topic);
			},
			'should not be empty': function(topic){
				assert.isNotEmpty(topic);
			},
			'should not be undefined': function(topic){
				assert.isDefined(topic);
			}
		}
	}).exportTo(module);
}
