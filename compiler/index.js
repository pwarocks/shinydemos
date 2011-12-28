var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');

var configs = require('../config.yaml').shift();

Handlebars.registerHelper('hyphenatedTag', function(tag) {
  return tag.split(' ').join('-');
});

var paths = {
  deploy: './deploy',
  source: './source',
  demos: './demos',
  layouts: {
    home: './layouts/index.html',
    demo: './layouts/demo.html',
    tag: './layouts/tag.html' 
  }
}

var homepageTemplate = Handlebars.compile(fs.readFileSync(paths.layouts.home).toString());
  
var tags = [], currenttag;


// Copy all demos to deployment folder

/*
ncp(paths.demos, paths.deploy + '/' + paths.demos, function(err) {
  if(err)
    console.error(err);  
console.log('copying demos to %s', paths.deploy + '/' + paths.demos);
}); 

// Copy Assets and Styles to deployment folder
ncp(paths.source, paths.deploy, function(err) {
  if(err)
    console.error("error copying source", err)
console.log('copying source assets to %s from %s', paths.deploy, paths.source);
}); 

*/
//Render index.html with our configs
for(var i = 0; i < configs.length; i++) {
  [].forEach.apply(configs[i].tags, [function(tag, i) {
    if(tags.indexOf(tag) == -1) {
      tags.push(tag);
    }
  }]);
}

var homepageRender = homepageTemplate({tags: tags});

fs.writeFileSync(paths.deploy + '/index.html', homepageRender);




