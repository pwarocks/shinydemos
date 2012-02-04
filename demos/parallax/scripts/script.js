(function() {
    var $docEl = $( document.documentElement ),
    $body = $( document.body ),
    $window = $( window ),
    $scrollpage = $body.find('#scrollpage'),
    $parallax = $body.find('#parallax'),
    $aside = $('<div class=aside/>'),
    $sections = $scrollpage.find('.planet'),
    $navtitles = $sections.find('h2'),
    $style = $('<style/>'),
    styles = [],
    $lastPlanet = null,
    $lastLink = null;
      
       
    function createNavigationMenu() {
      $navtitles.each(function(i, $navtitle) {
        lnk = $('<a>');
        lnk.attr('href','#'+ $navtitle.parentNode.id);
        lnk.attr('data-position', i);
        if (i === 0) {
          lnk.addClass('active');
          $lastLink = lnk;
        }
        lnk.click(function(e) {
            $lastLink && $lastLink.removeClass('active');
            e.preventDefault();
            $this = $(this); 
            $this.addClass('active');
            $lastLink = $this;
            moveplanets($this.attr('data-position'));
        });

        lnk.append($navtitle.textContent);
        $aside.append(lnk);
      });
        
      $body.append($aside);
    }
      
    createNavigationMenu();

   function moveplanets(position){
      $currentPlanet = $sections.eq(position);
      $lastPlanet && $lastPlanet.removeClass('active');
      $lastPlanet = $currentPlanet;
      $scalePlanetsHide = $currentPlanet.prevAll();
      $scalePlanetsShow = $currentPlanet.nextAll().andSelf();
      $sectionsLength = $sections.length;

      $scalePlanetsHide.each(function(i, planet){
        $planet = $(planet);
        $planet.removeClass();
        $planet.addClass('planet');
        setTimeout(function() { $sections.eq(i).addClass('scalehide-' + i); }, 0);
      });

      $scalePlanetsShow.each(function(i, planet) {
        $planet = $(planet);
        $planet.show();
        $planet.removeClass();
        $planet.addClass('planet scaleshow-' + (i));
      });

      setTimeout(function() { $parallax.removeClass(); $parallax.addClass('scale-' + position); $currentPlanet.addClass('active'); }, 0);
    }

    $sections.eq(0).addClass('active');
    $parallax.addClass('scale-0');

})();


