var ncp = require('ncp').ncp,
    fs = require('fs'),
    Handlebars = require('handlebars'),
    yaml = require('js-yaml'),
    jsdom = require('jsdom').jsdom,
    rimraf = require('rimraf'),
    pluckSupport = require('../lib/pluck'),
    shinydemos = exports,
    homepage, tagspage;
    
shinydemos.create = function() {
  var configs = require('../config.yaml').shift(),
      siteconfig = configs.siteconfig,
      features = configs.features;

  Handlebars.registerHelper('hyphenate', function(tag) {
    return tag.split(' ').join('-');
  });
  
  Handlebars.registerHelper('arrayify', function(tagsArray) {
    //tagsArray gets passed in from config.yml as a string, like "foo, bar, baz"
    //we need to convert this to an ES Array of strings to avoid reference errors 
    var result = tagsArray.split(',').map(function(tag){
      return '"' + tag + '"';
    });
    
    return result;
  });

  homepage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/home.html').toString());
  tagspage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/tag.html').toString());
  optionsjs = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/options.js').toString());

  //delete deploy folder
  console.log('Deleting old deploy folder and contents.')
  rimraf.sync(siteconfig.deployFolder);

  //create deploy folder
  console.log('Creating %s folder', siteconfig.deployFolder);
  fs.mkdirSync(siteconfig.deployFolder);

  // Copy all demos to deployment folder
  var demoArray = configs.demos.map(function(demo) {return demo.slug;});

  ncp(siteconfig.demosFolder, siteconfig.deployFolder, {filter: function(name) { 
      var currentfilestats = fs.statSync(name);
      var regEx = new RegExp('\/' + siteconfig.demosFolder + '\/([^/]*)$');
      var demodirectory = regEx.exec(name) && regEx.exec(name)[1];

      if(!demodirectory || (demoArray.indexOf(demodirectory) > -1)) {
        return true;
      } else { 
       return false; 
      } 
    } 
  }, function(err) {
    if(err) {
       console.error(err);
    }  else {
      console.log('Copied demos to %s from %s', siteconfig.demosFolder, siteconfig.deployFolder);
      createdemos();
    }
  });

  // Copy Assets and Styles to deployment folder
  ncp(siteconfig.sourceFolder, siteconfig.deployFolder, function(err) {
    if(err) {
      console.error("error copying source", err);
    }  else {
      console.log('Copied source assets to %s from %s', siteconfig.sourceFolder, siteconfig.deployFolder);
    }
  });

  //Render index.html with our configs
  function createdemos() {
    console.log('Creating demos from source files');
    var demosByTag = {};
    //demo that gets passed in is configs.demo
    [].forEach.call(configs.demos, function(demo, i) {
        console.log('now working on demo:', demo.slug);

        var demoPath = siteconfig.deployFolder + '/' + demo.slug + '/index.html';
        var win = jsdom(fs.readFileSync(demoPath).toString()).createWindow();
        
        //for now, inlining options.js template here at the bottom of the page
        var optsContainer = win.document.createElement('script');
        optsContainer.innerHTML = optionsjs({
          title: demo.title,
          legend: demo.legend,  
          tags: demo.tags.toString(),
          features: pluckSupport(features, demo.support.toString())
        });

        //hack to shut up JSDOM for now
        win.PhiloGL = {};
        win.PhiloGL.hasWebGL = function(){};
        win.appendPanel = function(){};

        win.document.body.appendChild(optsContainer);

        fs.writeFileSync(demoPath, win.document.doctype + "\n" + win.document.outerHTML);

        var tags = demo.tags.toString().split(',');
        tags.forEach(function(t){
          demosByTag[t] = demosByTag[t] || [];
          demosByTag[t].push(demo);
        });
    });

    renderHomePage(Object.keys(demosByTag));
    renderTagsPages(demosByTag);
    console.log('loldone');
    //i think i need some kind of process.exit() here
  }

  // homepage render
  function renderHomePage(allTags) {
    var homepageRender = homepage({'tags': allTags});
    fs.writeFileSync(siteconfig.deployFolder + '/index.html', homepageRender);
    console.log('Rendering homepage');
  };

  //tagspage render
  //need to get in the copy for the tags somewhere
  function renderTagsPages(demosByTag) {
    Object.keys(demosByTag).forEach(function(t) {
      var demos = demosByTag[t];
      var demoCollection = demos.map(function(d) {
        return {
          'path': '/' + d.slug + '/',
          'title': d.title,
          'thumb': '/' + d.slug + '/thumb.png',
          'demotags': d.tags
        }
      });

      fs.mkdirSync(siteconfig.deployFolder + '/' + t + '/');

      fs.writeFileSync(siteconfig.deployFolder + '/' + t + "/index.html", tagspage({'title': t, 'slugs': demoCollection }));
      console.log('Rendering %s page', t);
    });
  };
};

//Create demos project pages
shinydemos.create();