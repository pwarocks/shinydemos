module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		lint: {
			grunt: 'grunt.js',
			tests: 'test/*.js',
			lib: 'lib/*.js',
			// commenting out for now, probably need to agree on linting
			// options as a group
			// demos: 'demos/**/scripts/*.js',
			shared: 'source/scripts/panel.js'
		},
		// have a look at http://www.jshint.com/options/ to understand these
		jshint: {
			// Defaults.
			options: {
				curly: true, newcap: true, bitwise: true, forin: true, latedef: true
			},
			globals: {},
			// Just for the lint:grunt target.
			grunt: {
				options: {node: true},
				globals: {}
			},
			
			// Just for the lint:tests target.
			tests: {
				options: {node: true, loopfunc: true, boss: true},
				globals: {}
			},
			
			// Just for the lint:tests target.
			lib: {
				options: {browser: true, boss: true},
				globasl: {}
			},
			
			shared: {
				options: {shadow: true, expr: true}
			}
		}
	});
	
	// Default task.
	grunt.registerTask('default', 'lint');
};