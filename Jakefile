desc('Default build task');
task('default', function () {
	jake.Task.build.invoke();
});

desc('Build the site (for testing and deploy');
task('build', function (arg) {
	console.log('Building shinydemos.com...');
	jake.exec(['node ./index.js'], function() {
		console.log("Done!");
	}, {printStout: true, breakOnError: false});
});

desc('Run tests for shinydemos.com');
task('test', function () {
	jake.exec(['vows test/* --spec'], function() {
	  console.log("DONE");
	}, {printStdout: true});
});

namespace('test', function () {
	desc('The same as `jake test`');
	task('default', function () {
		jake.Task['test'].invoke();
	});

	desc('test:config will run the config tests on every entry in config.yml');
	task('config', function () {
		console.log('Running tests...');
		jake.exec([
			'node test/config-demos-test.js',
			'node test/config-features-test.js',
			'node test/config-siteconfig-test.js',
			'node test/config-tags-test.js',
			'node test/config-demos-tags-test.js'
		] , function() {
			console.log("Done!");
		}, {printStdout: true, breakOnError: true});
	});
});

namespace('deploy', function() {
	desc('Deploy to dev.shinydemos.com.');
	task('dev', function() {
		console.log('Deploying to dev.shinydemos.com');
		jake.exec(['node ../shinydemos-misc/deploy.js --env=dev'], function() {
			console.log("Done!");
		}, {printStdout: true});
	});
	
	desc('Deploy to shinydemos.com');
	task('prod', function() {
		console.log('Deploying to shinydemos.com');
		jake.exec(['node ../shinydemos-misc/deploy.js --env=prod'], function() {
			console.log("Done!");
		}, {printStdout: true});
	});
});