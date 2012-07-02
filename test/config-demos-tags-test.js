var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	getprop = require('../lib/categories').getPropFromTag,
	demos = config[0].demos,
	demoTags = config[0].demos.tags;

// - slug: beach
// title: 'Beach'
// legend: 'Wake up to the sound of waves breaking on shore. Press the button to open up your CSS gradient blinds, and see your room transition from dark to light. The beach is deserted, so why not try {swimsuit: none} ?'
// tags: [css3]
// support: [csstransitions, cssgradients]

for (var i = 0, demo; demo = demos[i]; i++) {
	for (var k = 0, demoTag; demoTag = demo.tags[k]; k++) {
		vows.describe('Test each demo tag').addBatch({
			'A demo tag': {
				topic: demoTag,
				'should be a string': function(topic){
					assert.isString(topic);
				},
				'should have a corresponding entry in the tags section': function(topic){
					assert.equal(topic, getprop('tagName', topic));
				}
			}
		}).exportTo(module);
	}
}