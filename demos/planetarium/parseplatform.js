var alltech = document.querySelectorAll('#content dl');
var categories = [];

[].forEach.call(alltech, function(cat) {
  var techs = cat.querySelectorAll('dd a:first-child');
  var catTechs = [];
  [].forEach.call(techs, function(tech) {
     catTechs.push({
      'href': tech.href,
      'title': tech.textContent 
      });
  });

  categories.push({
    'category': cat.querySelector('dt').textContent,
    'techs': catTechs
  });  
 });

console.log(JSON.stringify(categories));
