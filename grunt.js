module.exports = function(grunt) {
	var exec = require('child_process').exec,
		async = require('async');
	
	// Project configuration.
	grunt.initConfig({
		lint: {
			grunt: 'grunt.js',
			tests: 'test/*.js',
			lib: 'lib/*.js',
			//slowly adding all of these
			demos: [
				'demos/paranoid/scripts/*.js',
				'demos/rock-piano/scripts/*.js',
				'demos/svg-speedtest/scripts/*.js',
				'demos/tatami/scripts/*.js',
				'demos/touch-tracker/scripts/*.js',
				'demos/warholiser/scripts/*.js',
				'demos/hungry-kittens/scripts/game.js'
			],
			shared: 'source/scripts/panel.js'
		},
		// have a look at http://www.jshint.com/options/ to understand these
		jshint: {
			// Defaults.
			options: {
				curly: true, newcap: true, bitwise: true, forin: true, latedef: true
			},
			grunt: {
				options: {node: true}
			},
			tests: {
				options: {node: true, loopfunc: true, boss: true}
			},
			lib: {
				options: {browser: true, boss: true}
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
	
	grunt.registerTask('test', 'Run unit tests', function(){
		var done = this.async(),
			pass = true;
			
		if (this.args[0] == "config") {
			async.parallel([
				function(callback){
					//it seems that running a vows test via `node` doesn't emit
					//an error object, so this is a regexy hack around that
					exec('node test/config-demos-test.js', function (error, stdout, stderr) {
						grunt.log.writeln(stdout);
						callback(error, (/✗/.exec(stdout) !== null));
					});
				},
				function(callback){
					exec('node test/config-features-test.js', function (error, stdout, stderr) {
						grunt.log.writeln(stdout);
						callback(error, (/✗/.exec(stdout) !== null));
					});
				},
				function(callback){
					exec('node test/config-siteconfig-test.js', function (error, stdout, stderr) {
						grunt.log.writeln(stdout);
						callback(error, (/✗/.exec(stdout) !== null));
					});
				},
				function(callback){
					exec('node test/config-tags-test.js', function (error, stdout, stderr) {
						grunt.log.writeln(stdout);
						callback(error, (/✗/.exec(stdout) !== null));
					});
				},
				function(callback){
					exec('node test/config-demos-tags-test.js', function (error, stdout, stderr) {
						grunt.log.writeln(stdout);
						callback(error, (/✗/.exec(stdout) !== null));
					});
				}], 
			function(err, results){
				//if there's an error in one of the tests, the results array
				//will have a true in it somewhere. so to pass, you should not
				//have any match via [].indexOf()
				pass = (results.join().indexOf('true') === -1);

				done(pass);
			});
		} else {
			exec('vows', function (error, stdout, stderr) {
				grunt.log.writeln(stdout);
				
				if (error) {
					//if the test suite errors, pass will be false
					pass = (error.code === 0);
				}
				
				//now grunt can let us know we failed
				done(pass);
			});	
		}
	});
	
	grunt.registerTask('build', 'FIRE ZE MISSLES', function(){
		var done = this.async(),
			pass;
			
		exec('node ./index.js', function(error, stdout, stderr){
			grunt.log.writeln(stdout);
			
			if (error) {
			
				pass = (error.code === 0);
			}
			
			done(pass);
		});
	});
};