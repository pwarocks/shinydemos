(function() {
    var $body = $( document.body ),
    $parallax = $body.find('#parallax'),
    $aside = $('<div class=aside/>'),
    $sections = $body.find('.planet'),
    $navtitles = $sections.find('h2'),
    keys = [38, 40, 37,39],
    targetPlanet = 0,
    lastPlanet = 0,
    $links;

    var prefixes = 'O Webkit Moz ms'.split(' ');
   
    var currentPrefix =  (function() {
      var prefixedProperty =  prefixes.join('Transform ').split(' ').filter(function(prop){
          return (document.body.style[prop] !== undefined);
      });
      return prefixedProperty[0].split('Transform')[0].toLowerCase();
    })();
      
       
    function createNavigationMenu() {
      $navtitles.each(function(i, $navtitle) {
        lnk = $('<a>');
        lnk.attr('href','#'+ $navtitle.parentNode.id);
        lnk.attr('data-position', i);
        if (i === 0) {
          lnk.addClass('active');
        }
        lnk.click(function(e) {
          e.preventDefault();
          targetPlanet = +$(this).attr('data-position');
          if(lastPlanet != targetPlanet) {
            changePlanets();
          } 
          lastPlanet = targetPlanet;
        });

        lnk.append($navtitle.textContent);
        $aside.append(lnk);
      });
        
      $body.append($aside);

      return $aside.find('a');
    }
      

   function changePlanets() {
      $links.eq(lastPlanet).removeClass('active');
      if(lastPlanet > targetPlanet) {
        moveToPlanet(lastPlanet - 1, targetPlanet, lastPlanet);
      } else {
        moveToPlanet(lastPlanet + 1, targetPlanet, lastPlanet);
      }
      $links.eq(targetPlanet).addClass('active');
   };

   function moveToPlanet(planet, targetPlanet, prevPlanet){

     if(prevPlanet == targetPlanet) { return; }


      var $currentPlanet = $sections.eq(planet);
      var nextPlanet = planet > targetPlanet ? planet - 1 : planet + 1;

      $prevPlanet = $sections.eq(planet - 1);
      $prevPlanet.removeClass('active scaleshow-0').addClass('scalehide-' + (planet - 1));

      $currentPlanet[0].addEventListener((currentPrefix === 'moz'? 'transitionend' : currentPrefix + 'TransitionEnd'), changePlanet, true);

      function changePlanet(event) { 
        if(event.propertyName == '-' + currentPrefix + '-transform') {
          moveToPlanet(nextPlanet, targetPlanet, planet);
          event.target.removeEventListener(event.type, changePlanet, true); 
        }
      }

      $scalePlanetsShow = $currentPlanet.nextAll().andSelf();

      $scalePlanetsShow.each(function(i, planet) {
        $planet = $(planet);
        $planet.removeClass();
        $planet.addClass('planet scaleshow-' + (i));
      });

      $parallax.removeClass(); 
      $parallax.addClass('scale-' + planet); 
      $currentPlanet.addClass('active');


    }


    function init() {
      
      $links = createNavigationMenu();

      $sections.eq(0).addClass('active');
      $parallax.addClass('scale-0');

      
      window.onkeyup = function(e) {
        var keyPressed = keys.indexOf(e.keyCode);

        if(keyPressed > -1) {
          if(e.keyCode == 38 || e.keyCode == 37) {
            targetPlanet = targetPlanet > 0 ? targetPlanet - 1 : 0;
          } else if(e.keyCode == 40 || e.keyCode == 39) {
            targetPlanet = targetPlanet < ($sections.length - 1) ? targetPlanet + 1 : ($sections.length - 1);
          }

          changePlanets();

          lastPlanet = targetPlanet;
          e.preventDefault();
        }
        
      };
    };

    init();
    

})();


