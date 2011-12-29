var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');

var configs = require('../config.yaml').shift();

Handlebars.registerHelper('hyphenatedTag', function(tag) {
  return tag.split(' ').join('-');
});

Handlebars.registerHelper('tag', function(tag) {
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

var tagspageTemplate = Handlebars.compile(fs.readFileSync(paths.layouts.tag).toString());
  
var slugsPerTag = [], tagfound = false, slugs;


// Copy all demos to deployment folder
ncp(paths.demos, paths.deploy + '/' + paths.demos, function(err) {
  if(err) {
     console.error(err);   
  }
  console.log('copying demos to %s', paths.deploy + '/' + paths.demos);
}); 

// Copy Assets and Styles to deployment folder
ncp(paths.source, paths.deploy, function(err) {
  if(err) {
    console.error("error copying source", err);    
  }
  console.log('copying source assets to %s from %s', paths.deploy, paths.source);
}); 


//Render index.html with our configs
[].forEach.apply(configs, [function(config, i) {
  var tag = config.tags.toString().split(',');
    
  tag.forEach(function(t) 
  {
    tagfound = false;
    slugsPerTag.forEach(function(s) {
      if(s.tag == t) {
        tagfound = true;
        s.slugs.push(config);
      } 
    });
    
    if(!tagfound) {
      slugsPerTag.push({
        'tag': t,
        'slugs': [config]
      });
    }
  });
}]);

// homepage render
var homepageRender = homepageTemplate({tags: slugsPerTag});
fs.writeFileSync(paths.deploy + '/index.html', homepageRender);
console.log('homepage rendered…'); 

//tagspage render
slugsPerTag.forEach(function(t) {
  slugs = t.slugs, slugCollection = [];
  slugs.forEach(function(s) {
    slugCollection.push({
      'path': "../" + s.slug + '.html',
      'title': s.title,
      'thumb': './images/' + s.slug + '/thumb.png',
      'demotags': s.tags.toString()
    });    
  });  
  
   fs.writeFileSync(paths.deploy + '/' + t.tag + ".html", tagspageTemplate({'title': t.tag,
   'slugs': slugCollection })); 
  console.log('rendered %s page', t.tag);
});



