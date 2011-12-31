var ncp = require('ncp').ncp;
var fs = require('fs');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');
var jsdom = require('jsdom').jsdom;

var configs = require('../config.yaml').shift();
var siteconfig = configs.siteconfig;

// Handlebar helper to hyphenate tags that are more than a word
Handlebars.registerHelper('hyphenate', function(tag) {
  return tag.split(' ').join('-');
});

// Compile all the templates
var homepageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/home.html').toString());
var tagspageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/tag.html').toString());
var demopageTemplate = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/demo.html').toString());
  

//Check if demos folder exists in deploy folder
var deployedDemosFolder = siteconfig.deployFolder + '/demos';


[siteconfig.deployFolder,deployedDemosFolder].forEach(function(folder) {
  try {
    fs.lstatSync(folder);  
  } catch (e) {
    console.log('%s folder does not exist. Creating…', folder);
    fs.mkdirSync(folder);    
  }
});


// Copy all demos to deployment folder
ncp(siteconfig.demosFolder, deployedDemosFolder, function(err) {
  if(err) {
     console.error(err);   
  }  else {
    console.log('copied demos to %s from %s', siteconfig.demosFolder, deployedDemosFolder);
    createdemos();      
  }  
});

// Copy Assets and Styles to deployment folder
ncp(siteconfig.sourceFolder, siteconfig.deployFolder, function(err) {
  if(err) {
    console.error("error copying source", err);    
  }  else {
    console.log('copied source assets to %s from %s', siteconfig.sourceFolder, siteconfig.deployFolder);        
  }
}); 

//Render index.html with our configs
function createdemos() {
  console.log('creating demos from source files');
  var demosByTag = {};
  [].forEach.call(
    configs.demos,
    function(demo, i) {
      var browserArray = siteconfig.browsers.map(function(browser) {
        return {
          'browser': browser,
          'supportedBrowser': demo.support.indexOf(browser) > -1 ?  ' ' + siteconfig.supportedBrowserClass : ''
        };    
      });
      
      var demoPath = deployedDemosFolder + '/' + demo.slug + '/index.html';
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

      var tags = demo.tags.toString().split(',');    
      tags.forEach(function(t) 
      {
        demosByTag[t] = demosByTag[t] || [];
        demosByTag[t].push(demo);
      });         
  });

  renderHomePage(Object.keys(demosByTag));
  renderTagsPages(demosByTag);    
}

// homepage render
function renderHomePage(allTags) {
  var homepageRender = homepageTemplate({'tags': allTags});
  fs.writeFileSync(siteconfig.deployFolder + '/index.html', homepageRender);
  console.log('homepage rendered…');   
};

//tagspage render
function renderTagsPages(demosByTag) {
  Object.keys(demosByTag).forEach(function(t) {
    var demos = demosByTag[t];
    var demoCollection = demos.map(function(d) {
      return {
        'path': siteconfig.demosFolder + '/' + d.slug + '/',
        'title': d.title,
        'thumb': './images/' + d.slug + '/thumb.png',
        'demotags': d.tags.toString()        
      }
    });

     fs.writeFileSync(siteconfig.deployFolder + '/' + t + ".html", tagspageTemplate({'title': t, 'slugs': demoCollection })); 
     console.log('rendered %s page', t);
  });  
};

