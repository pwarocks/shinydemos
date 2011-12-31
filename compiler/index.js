var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');
var jsdom = require('jsdom').jsdom;

var configs = require('../config.yaml').shift();
var siteconfig = configs.siteconfig;

Handlebars.registerHelper('hyphenatedTag', function(tag) {
  return tag.split(' ').join('-');
});

Handlebars.registerHelper('tag', function(tag) {
  return tag.split(' ').join('-');
});

// Compile all the templates
var homepageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/home.html').toString());
var tagspageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/tag.html').toString());
var demopageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/demo.html').toString());
  
var slugsPerTag = [], tagfound = false, slugs;

//Check if demos folder exists in deploy folder
var deployedDemosFolder = siteconfig.deployFolder + '/demos';

try {
  fs.lstatSync(siteconfig.deployFolder);  
} catch (e) {
  fs.mkdirSync(siteconfig.deployFolder);  
  console.log('Deploy folder does not exist. Creating…');
}

try {
  fs.lstatSync(deployedDemosFolder);  
} catch (e) {
  fs.mkdirSync(deployedDemosFolder);  
  console.log('Demos folder does not exist. Creating…');
}

// Copy all demos to deployment folder
ncp(siteconfig.demosFolder, deployedDemosFolder, function(err) {
  if(err) {
     console.error(err);   
  }
  
  // Copy Assets and Styles to deployment folder
  ncp(siteconfig.sourceFolder, siteconfig.deployFolder, function(err) {
    if(err) {
      console.error("error copying source", err);    
    }  
    console.log('copying source assets to %s from %s', siteconfig.sourceFolder, siteconfig.deployFolder);    
  }); 
  
  console.log('copying demos to %s from %s', siteconfig.demosFolder, deployedDemosFolder);

  //stupid callbacks
  createdemos();  
}); 

// homepage render
function renderHomePage() {
  var homepageRender = homepageTemplate({tags: slugsPerTag});
  fs.writeFileSync(siteconfig.deployFolder + '/index.html', homepageRender);
  console.log('homepage rendered…');   
};

//tagspage render
function renderTagsPages() {
  slugsPerTag.forEach(function(t) {
    slugs = t.slugs, slugCollection = [];
    slugs.forEach(function(s) {    
      slugCollection.push({
        'path': siteconfig.demosFolder + '/' + s.slug + '/index.html',
        'title': s.title,
        'thumb': './images/' + s.slug + '/thumb.png',
        'demotags': s.tags.toString()
      });    
    });  

     fs.writeFileSync(siteconfig.deployFolder + '/' + t.tag + ".html", tagspageTemplate({'title': t.tag, 'slugs': slugCollection })); 
     console.log('rendered %s page', t.tag);
  });  
};

//Render index.html with our configs
function createdemos() {
  console.log('creating demos from source files');
  [].forEach.apply(configs.demos, [function(demo, i) {
    var browserArray = [];
    var demoPath = deployedDemosFolder + '/' + demo.slug + '/index.html';
    siteconfig.browsers.forEach(function(browser) {
      browserArray.push({
        'browser': browser,
        'supportedBrowser': demo.support.indexOf(browser) > -1 ?  ' ' + siteconfig.supportedBrowserClass : ''
      });    
    });

    var win = jsdom(fs.readFileSync(demoPath).toString()).createWindow();
    var panelContainer = win.document.createElement(siteconfig.panelTag);
    var panelCSS = win.document.createElement('link');

    panelCSS.rel = 'stylesheet';
    panelCSS.href = '../../styles/' + siteconfig.panelCSS;

    panelContainer.className = siteconfig.panelClass;
    panelContainer.innerHTML = demopageTemplate({ 'title': demo.title, 'browsers': browserArray });

    win.document.getElementsByTagName('head')[0].appendChild(panelCSS);
    win.document.body.insertBefore(panelContainer, win.document.body.firstChild);  

    fs.writeFileSync(demoPath, win.document.doctype.toString() + win.document.outerHTML);

    var tag = demo.tags.toString().split(',');    
    tag.forEach(function(t) 
    {
      tagfound = false;
      slugsPerTag.forEach(function(s) {
        if(s.tag == t) {
          tagfound = true;
          s.slugs.push(demo);
        } 
      });

      if(!tagfound) {
        slugsPerTag.push({
          'tag': t,
          'slugs': [demo]
        });
      }
    });        
  }]);

  renderHomePage();
  renderTagsPages();    
}
