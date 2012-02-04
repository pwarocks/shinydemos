var fs = require('fs');
var Handlebars = require('handlebars');

var planetObjects = JSON.parse(fs.readFileSync('platform.json'));

planetObjects.forEach(function(planetObject) {
  var allocatedNumbers = [];
  planetObject.skin = Math.floor(Math.random()*4);
  planetObject.techs.forEach(function(tech) {
   var currentAllocation =  Math.floor(Math.random()*10);
   while(allocatedNumbers && (allocatedNumbers.indexOf(currentAllocation) > -1)) {
      currentAllocation = Math.floor(Math.random()*10);
   }
   tech.class = 'spec-' + currentAllocation;   
   allocatedNumbers.push(currentAllocation);
 });
});

var source = fs.readFileSync('template.html').toString();
var template = Handlebars.compile(source);    


var html = template({features: planetObjects });

fs.writeFileSync('index.html', html);

