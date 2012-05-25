var ncp = require('ncp').ncp,
    fs = require('fs'),
    Handlebars = require('handlebars'),
    yaml = require('js-yaml'),
    jsdom = require('jsdom').jsdom,
    rimraf = require('rimraf'),
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
    var demosByTag = {};
    //demo that gets passed in is configs.demo
    [].forEach.call(configs.demos, function(demo, i) {
        console.log('now working on demo:', demo.slug);

        var demoPath = siteconfig.deployFolder + '/' + demo.slug + '/index.html',
            document = jsdom(fs.readFileSync(demoPath).toString(), null, {
              features: {
                FetchExternalResources: ['script'],
                ProcessExternalResources: false
              }
            });
        
        //for now, inlining options.js template here at the bottom of the page
        var optsContainer = document.createElement('script');

        optsContainer.innerHTML = optionsjs({
          title: demo.title,
          legend: demo.legend,  
          tags: demo.tags.toString(),
          features: pluckSupport(features, demo.support.toString()),
          version: new Date().getTime()
        });

        document.body.appendChild(optsContainer);

        fs.writeFileSync(demoPath, document.doctype + "\n" + document.outerHTML);

        var tags = demo.tags.toString().split(',');
        tags.forEach(function(t){
          demosByTag[t] = demosByTag[t] || [];
          demosByTag[t].push(demo);
        });
    });

    renderHomePage(Object.keys(demosByTag));
    renderTagsPages(demosByTag);
    console.log('Done!');
  }

  // homepage render
  function renderHomePage(allTags) {
    var homepageRender = homepage({'tags': allTags});
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
              'thumb': '/' + demo.slug + '/thumb.png',
              'demotags': demo.tags
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