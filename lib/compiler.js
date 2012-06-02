var ncp = require('ncp').ncp,
    fs = require('fs'),
    Handlebars = require('handlebars'),
    yaml = require('js-yaml'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    pluckSupport = require('../lib/pluck'),
    category = require('../lib/categories'),
    getFile = require('../lib/filename'),
    demoFilter = require('../lib/demofilter'),
    configs = require('../config.yaml').shift(),
    siteconfig = configs.siteconfig,
    features = configs.features,
    categories = configs.tags;

//register handlebars helpers
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
});

exports.renderHomePage = function(tagNames) {
  var homepage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/home.html').toString());
  
  fs.writeFile(siteconfig.deployFolder + '/index.html', homepage({
    tagName: tagNames
  }), console.log('Rendered homepage'));
}

exports.renderTagsPages = function(demosByTag) {
  var tagspage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/tag.html').toString()),
      filesArray = fs.readdirSync(siteconfig.deployFolder + '/thumbs'),
      demosArray = Object.keys(demosByTag);
      
  demosArray.forEach(function(tag) {
    var demos = demosByTag[tag],
    demoCollection = demos.map(function(demo) {
      return {
        'path': '/' + demo.slug + '/',
        'title': demo.title,
        'thumb': '/thumbs/' + getFile(filesArray, demo.slug),
        'demotags': demo.tags.sort()
      }
    });
    
    fs.mkdir(siteconfig.deployFolder + '/' + tag + '/', function(){
      fs.writeFile(siteconfig.deployFolder + '/' + tag + "/index.html", tagspage({
        title: category.displayName(categories, tag), 
        tagline: category.tagline(categories, tag),
        slugs: demoCollection,
      }), console.log('Rendered %s page', tag));
    });
  });
};

//Render options.js for each demo based on config.yml
exports.renderDemos = function() {
  var optionsjs = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/options.js').toString()),
      demosByTag = {}, 
      tagNames, optsjs;
      
  console.log('Creating demos from source files');
  
  //demo that gets passed in is configs.demo
  [].forEach.call(configs.demos, function(demo, i) {
      var optsRoot = siteconfig.deployFolder + '/' + demo.slug + '/scripts',
          optsPath = optsRoot + '/options.js', 
          tags = demo.tags.toString().split(','), 
          optsjs;

      //create the /scripts/ folder if it doesn't exist
      mkdirp(optsRoot, function(){
        //then render the options.js template
        fs.writeFile(optsPath, optionsjs({
          title: demo.title,
          legend: demo.legend,
          tags: demo.tags.toString(),
          features: pluckSupport(features, demo.support.toString()),
          version: new Date().getTime()
        }), console.log('Rendered options.js for', demo.slug));
      });
  
      tags.forEach(function(t){
        demosByTag[t] = demosByTag[t] || [];
        demosByTag[t].push(demo);
      });
      
      //Odin is a git submodule, so we can't change it at the source
      //So we rename demo.html to index.html here.
      if (demo.slug == "odin") {
        fs.rename(siteconfig.deployFolder + '/odin/demo.html', siteconfig.deployFolder + '/odin/index.html');
      }
  });
  
  exports.renderHomePage(Object.keys(demosByTag));
  exports.renderTagsPages(demosByTag);
}

exports.create = function() {
  //delete deploy folder
  console.log('Deleting old deploy folder and contents.')
  rimraf.sync(siteconfig.deployFolder);

  //create deploy folder
  console.log('Creating %s folder', siteconfig.deployFolder);
  fs.mkdir(siteconfig.deployFolder, function(){
    // Copy all demos to deployment folder
    ncp(siteconfig.demosFolder, siteconfig.deployFolder, {filter: demoFilter}, function(err) {
      if(err) console.error(err);
      console.log('Copied demos to %s from %s', siteconfig.demosFolder, siteconfig.deployFolder);
      exports.renderDemos();
    });
    
    // Copy Assets and Styles to deployment folder
    ncp(siteconfig.sourceFolder, siteconfig.deployFolder, function(err) {
      if (err) console.error("error copying source", err);
      console.log('Copied source assets to %s from %s', siteconfig.sourceFolder, siteconfig.deployFolder);
    });
  });
}