var ncp = require('ncp').ncp,
    fs = require('fs'),
    Handlebars = require('handlebars'),
    yaml = require('js-yaml'),
    jsdom = require('jsdom').jsdom,
    rimraf = require('rimraf'),
    minifier = require('html-minifier'),
    shinydemos = exports,
    homepage, tagspage, demopage, featuresupport;

shinydemos.create = function() {
  var configs = require('../config.yaml').shift();
  var siteconfig = configs.siteconfig;

  Handlebars.registerHelper('hyphenate', function(tag) {
    return tag.split(' ').join('-');
  });

  // Compile all the templates
  homepage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/home.html').toString());
  tagspage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/tag.html').toString());
  demopage = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/demo.html').toString());
  featuresupport = Handlebars.compile(fs.readFileSync(siteconfig.layoutsFolder + '/featuresupport.html').toString());

  //delete deploy folder
  console.log('Deleting old deploy folder and contents.')
  rimraf.sync(siteconfig.deployFolder);

  //create deploy folder
  console.log('Creating %s folder', siteconfig.deployFolder);
  fs.mkdirSync(siteconfig.deployFolder);

  // Copy all demos to deployment folder
  var demoArray = configs.demos.map(function(demo) {return demo.slug;});

  var demofilter = function(filename) {
    console.log(filename);
    var fileStat = fs.statSync(filename);
    if (fileStat.isDirectory()=== true) {
      return (demoArray.indexOf(filename) > -1); 
    } else {
      return true;
    }
  };

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
    [].forEach.call(
      configs.demos,
      function(demo, i) {
        console.log('now working on demo:', demo.title);

        var demoPath = siteconfig.deployFolder + '/' + demo.slug + '/index.html';
        var win = jsdom(fs.readFileSync(demoPath).toString()).createWindow();

        var panelContainer = win.document.createElement(siteconfig.panelTag);
        var panelCSS = win.document.createElement('link');
        var panelJS = win.document.createElement('script');

        var featuresupportContainer = win.document.createElement('div');
        featuresupportContainer.innerHTML = featuresupport({'features': demo.support});


        panelCSS.rel = 'stylesheet';
        panelCSS.href = '/styles/' + siteconfig.panelCSS;
        panelJS.src = '/scripts/' + siteconfig.panelJS;

        panelContainer.className = siteconfig.panelClass;
        panelContainer.innerHTML = demopage({ 'title': demo.title, 'features': demo.support });

        console.log('wrapping', demo.title);
        win.document.getElementsByTagName('head')[0].appendChild(panelCSS);
        win.document.getElementsByTagName('head')[0].appendChild(panelJS);
        win.document.body.insertBefore(panelContainer, win.document.body.firstChild);
        win.document.body.appendChild(featuresupportContainer);

        fs.writeFileSync(demoPath, minifier.minify(win.document.doctype.toString() + win.document.outerHTML, { 'collapseWhitespace': false, 'removeComments': true }));

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
    var homepageRender = homepage({'tags': allTags});
    fs.writeFileSync(siteconfig.deployFolder + '/index.html', homepageRender);
    console.log('Rendering homepage.');
  };

  //tagspage render
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
