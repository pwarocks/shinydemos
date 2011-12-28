var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');

var configs = require('../config.yaml').shift();

var paths = {
  deploy: './deploy',
  source: './source',
  demos: './demos',
  layouts: './layouts' 
}


// Copy all demos to deployment folder
ncp(paths.demos, paths.deploy + '/' + paths.demos, function(err) {
  if(err)
    console.error(err);

  // Copy Assets and Styles to deployment folder
  ncp(paths.source, paths.deploy, function(err) {
    if(err)
      console.error("error copying source", err)
  }); 
  
  
  console.log('done!');
}); 



