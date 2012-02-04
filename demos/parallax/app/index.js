var fs = require('fs');
var Handlebars = require('handlebars');

var planetObjects = JSON.parse(fs.readFileSync('platform.json'));

var skinSelection = [];

planetObjects.forEach(function(planetObject, index) {
  var allocatedNumbers = [];
  if (index%4 === 0) {
    skinSelection = [];    
  }
  
  currentSkin = Math.floor(Math.random()*4);
  while (index %4 !== 0 && skinSelection && skinSelection.indexOf(currentSkin) > -1) {
    currentSkin = Math.floor(Math.random()*4);
  }

  skinSelection.push(currentSkin);
  planetObject.skin = currentSkin;
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

