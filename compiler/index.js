var ncp = require('ncp').ncp,
    fs = require('fs'),
    Handlebars = require('handlebars'),
    yaml = require('js-yaml'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    pluckSupport = require('../lib/pluck'),
    category = require('../lib/categories'),
    shinydemos = exports,
    homepage, tagspage, optionsjs;
    
shinydemos.create = function() {
  var configs = require('../config.yaml').shift(),
      siteconfig = configs.siteconfig,
      features = configs.features,
      categories = configs.tags;

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
  
  Handlebars.registerHelper('displayName', function(tag) {
    return category.displayName(categories, tag);
  })

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

  //Render index.html for each demo based on config.yml
  function createdemos() {
    console.log('Creating demos from source files');
    var demosByTag = {}, tagNames, optsjs;
    //demo that gets passed in is configs.demo
    [].forEach.call(configs.demos, function(demo, i) {
        console.log('now working on demo:', demo.slug);

        //Odin is a git submodule, so we can't change it at the source
        //But we can rename demo -> index here.
        if (demo.slug == "odin") {
          fs.rename(siteconfig.deployFolder + '/odin/demo.html', siteconfig.deployFolder + '/odin/index.html');
        }

        var optsRoot = siteconfig.deployFolder + '/' + demo.slug + '/scripts',
            optsPath = siteconfig.deployFolder + '/' + demo.slug + '/scripts/options.js',

        optsjs = optionsjs({
          title: demo.title,
          legend: demo.legend,
          tags: demo.tags.toString(),
          features: pluckSupport(features, demo.support.toString()),
          version: new Date().getTime()
        });

        //create the /scripts/ folder if it doesn't exist
        mkdirp.sync(optsRoot);
        //then write the options to the file system
        fs.writeFileSync(optsPath, optsjs);

        var tags = demo.tags.toString().split(',');

        tags.forEach(function(t){
          demosByTag[t] = demosByTag[t] || [];
          demosByTag[t].push(demo);
        });
    });
    
    tagNames = Object.keys(demosByTag);

    renderHomePage(tagNames);
    renderTagsPages(demosByTag);
    console.log('Done!');
  }

  // homepage render
  function renderHomePage(tagNames) {

    var homepageRender = homepage({tagName: tagNames});
    
    fs.writeFileSync(siteconfig.deployFolder + '/index.html', homepageRender);
    console.log('Rendering homepage');
  };

  // tags page render
  function renderTagsPages(demosByTag) {
    Object.keys(demosByTag).forEach(function(tag) {
      var demos = demosByTag[tag],
          demoCollection = demos.map(function(demo) {
            return {
              'path': '/' + demo.slug + '/',
              'title': demo.title,
              'thumb': '/thumbs/' + demo.slug + '.png',
              'demotags': demo.tags.sort()
            }
          });

      fs.mkdirSync(siteconfig.deployFolder + '/' + tag + '/');

      fs.writeFileSync(siteconfig.deployFolder + '/' + tag + "/index.html", tagspage({
        title: category.displayName(categories, tag), 
        tagline: category.tagline(categories, tag),
        slugs: demoCollection,
      }));
      
      console.log('Rendering %s page', tag);
    });
  };
};

//Create demos project pages
shinydemos.create();