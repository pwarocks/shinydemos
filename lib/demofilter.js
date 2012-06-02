exports.demoFilter = function(name) {
  var demoArray = configs.demos.map(function(demo) {return demo.slug;}),
	  regEx = new RegExp('\/' + siteconfig.demosFolder + '\/([^/]*)$'),
	  demodirectory = regEx.exec(name) && regEx.exec(name)[1];

  if(!demodirectory || (demoArray.indexOf(demodirectory) > -1)) {
	return true;
  } else { 
	return false; 
  } 
}