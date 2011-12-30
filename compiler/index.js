var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');
var jsdom = require('jsdom').jsdom;

var configs = require('../config.yaml').shift();

// Preparation for Demo page cleanup
var browsers = ['opera', 'chrome', 'safari', 'firefox', 'ie'];
var cssHref = '../../styles/panel.css';

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

var demopageTemplate = Handlebars.compile(fs.readFileSync(paths.layouts.demo).toString());
  
var slugsPerTag = [], tagfound = false, slugs;


// Copy all demos to deployment folder

ncp(paths.demos, paths.deploy + '/' + paths.demos, function(err) {
  if(err) {
     console.error(err);   
  }
  
  // Copy Assets and Styles to deployment folder
  ncp(paths.source, paths.deploy, function(err) {
    if(err) {
      console.error("error copying source", err);    
    }  
    console.log('copying source assets to %s from %s', paths.deploy, paths.source);    
  }); 
  
  console.log('copying demos to %s from %s', paths.deploy, paths.demos);

  //stupid callbacks
  createdemos();  
}); 

// homepage render
function renderHomePage() {
  var homepageRender = homepageTemplate({tags: slugsPerTag});
  fs.writeFileSync(paths.deploy + '/index.html', homepageRender);
  console.log('homepage rendered…');   
};

//tagspage render
function renderTagsPages() {
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

     fs.writeFileSync(paths.deploy + '/' + t.tag + ".html", tagspageTemplate({'title': t.tag, 'slugs': slugCollection })); 
     console.log('rendered %s page', t.tag);
  });  
};

//Render index.html with our configs
function createdemos() {
  console.log('creating demos from source files');
  [].forEach.apply(configs, [function(config, i) {
    var browserArray = [];

    browsers.forEach(function(browser) {
      browserArray.push({
        'browser': browser,
        'isSupported': config.support.indexOf(browser) > -1 ? true : false
      });    
    });

    var demo = fs.readFileSync(paths.deploy + '/demos/'+ config.slug + '/index.html').toString();
    doc = jsdom(demo);
    var win = doc.createWindow();
    var appendText = win.document.createElement('div');
    var cssLink = win.document.createElement('link');

    cssLink.rel = 'stylesheet';
    cssLink.href = cssHref;

    appendText.className = 'sd-panel';
    appendText.innerHTML = demopageTemplate({ 'title': config.title, 'browsers': browserArray });

    win.document.getElementsByTagName('head')[0].appendChild(cssLink);
    win.document.body.insertBefore(appendText, win.document.body.firstChild);  

    fs.writeFileSync(paths.deploy + '/demos/' + config.slug + "/index.html", win.document.doctype.toString() + win.document.outerHTML);

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

  renderHomePage();
  renderTagsPages();    
}
