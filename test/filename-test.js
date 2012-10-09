var vows = require('vows'),
	assert = require('assert'),
	filename = require('../lib/filename');

var filesArray = ['dog.jpg', 'ducks.jpg', 'deadducks.gif', 'cat.png', 'duck.webp'];

vows.describe('Test thumb image file name module').addBatch({
	'Getting the thumb image filename': {
		'for a "duck" demo': {
			topic: filename(filesArray, 'duck'),
			'returns "duck.webm"': function(topic){
				assert.equal(topic, 'duck.webp');
			},
			'doensn\'t return "ducks.jpg"': function(topic){
				assert.notEqual(topic, 'ducks.jpg');
			},
			'doesn\'t return "deadducks.gif"': function(topic){
				assert.notEqual(topic, 'deadducks.gif');
			},
			'returns a string': function(topic){
				assert.isString(topic);
			},
			'has a file extension': function(topic){
				assert.match(topic, /\.webp/);
			}
		}
	}
}).exportTo(module);