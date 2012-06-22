var vows = require('vows'),
	assert = require('assert'),
	yaml = require('js-yaml'),
	config = require('../config.yaml'),
	category = require('../lib/categories');
	
//TODO: consider fixtures in case config.yml copy changes

vows.describe('Category filtering').addBatch({
	'When getting a displayName from': {
		'CSS3': {
			topic: category.getPropFromTag('displayName', 'css3'),
			'css3 -> "CSS 3"': function(topic){
				assert.equal(topic, 'CSS 3');
			}	
		},
		'SVG': {
			topic: category.getPropFromTag('displayName', 'svg'),
			'svg -> "SVG"': function(topic){
				assert.equal(topic, 'SVG');
			}
		}
	},
	'When getting a tagline from': {
		'CSS3': {
			topic: category.getPropFromTag('tagline', 'css3'),
			'contains Håkon Wium Lie': function(topic){
				assert.match(topic, /Håkon Wium Lie/);
			}
		},
		'SVG': {
			topic: category.getPropFromTag('tagline', 'svg'),
			'contains Scalable Vector Graphics': function(topic){
				assert.match(topic, /Scalable Vector Graphics/);
			}
		}
	},
	'When getting a non-existent property': {
		topic: 'IDontExist',
		'it should throw': function(topic){
			assert.throws(function(){
				category.getPropFromTag(topic, 'css3')
			}, Error);
		}
	},
	'When passing a bogus tag': {
		topic: category.getPropFromTag('displayName', 'ponies'),
		'it should return undefined': function(topic){
			assert.isUndefined(topic);
		}
	}
}).exportTo(module);