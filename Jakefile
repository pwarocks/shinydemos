desc('Default build task');
task('default', function () {
	jake.Task.build.invoke();
});

desc('Build the site (for testing and deploy');
task('build', function (arg) {
	console.log('Building shinydemos.com...');
	jake.exec(['node ./index.js'], function() {
		console.log("Done!");
	}, {printStout: true, breakOnError: true});
});