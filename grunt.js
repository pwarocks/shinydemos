module.exports = function(grunt) {
	var exec = require('child_process').exec;
	
	// Project configuration.
	grunt.initConfig({
		lint: {
			grunt: 'grunt.js',
			tests: 'test/*.js',
			lib: 'lib/*.js',
			// commenting out for now, slowly getting
			// a lot of code linted
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
			},
			
			demos: {
				options: {smarttabs: true, sub:true, browser:true, shadow: true, expr: true}
			}
		}
	});
	
	// Default task.
	grunt.registerTask('default', 'lint');
	
	grunt.registerTask('deploy', 'Deploy the site', function(){
		var done;
		
		if (this.args[0] == "dev") {
			done = this.async();
			grunt.log.writeln('Deploying the site to ' + 'dev.shinydemos.com'.green);
			exec('node ../shinydemos-misc/deploy.js --env=dev', function(){
				done();
			});
			
		} else if (this.args[0] == "prod") {
			done = this.async();
			grunt.log.writeln('Deploying the site to ' + 'shinydemos.com'.green);
			exec('node ../shinydemos-misc/deploy.js --env=prod', function(){
				done();
			});
			
		} else {
			grunt.log.writeln('Unknown deploy target'.red);
			return false;
		}
	});
};