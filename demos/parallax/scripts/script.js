(function() {
    var $docEl = $( document.documentElement ),
    $body = $( document.body ),
    $window = $( window ),
    $scrollpage = $body.find('#scrollpage'),
    $scrollable = $body,
    $bodyWidth = $body.width(),
    $aside = $('<div class=aside/>'),
    $sections = $scrollpage.find('.planet'),
    $navtitles = $sections.find('h2'),
    $style = $('<style/>'),
    styles = [],
    numsections = $sections.length,
          clickcount = 0,
          prefixes = ' -o- -webkit- -moz- -ms- '.split(' ');
      
    if ( $docEl.scrollLeft() ) {
      $scrollable = $docEl;
    } else {
      var bodyST = $body.scrollLeft();
      if ( $body.scrollLeft( bodyST + 1 ).scrollLeft() == bodyST) {
        $scrollable = $docEl;
      } else {
        $body.scrollLeft( bodyST - 1 );
      }
    } 

    
    function createNavigationMenu() {
      $navtitles.each(function(i, $navtitle) {
          lnk = $('<a>');
        lnk.attr('href','#'+ $navtitle.parentNode.id);
        lnk.click(function(e) {
            e.preventDefault(); 
            $scrollable.animate( { scrollLeft: $(this.hash).position().left }, 600, 'linear' );
        });

        lnk.append($navtitle.innerText);
        $aside.append(lnk);
      });

        //styles.push('.parent' + i + ' { ' + prefixes.join( 'transform: translate(' + i*currentwidth + 'px, );') + '}');
        
      $body.append($aside);
    }
      
    createNavigationMenu();
    $style.text('#scrollpage .planet { width: ' + $bodyWidth + 'px; }');
    $(document.head).append($style);

     // auto highlight nav links depending on doc position
      var deferred = false,
          timeout = false,    
          last = false, 
          lastscroll = null,
          scroll = null,
          cache = $aside.find('a');
          check = function() {
            $scrollable.css({'overflow': 'hidden'});
              scroll = $scrollable.scrollLeft();
              $scrollable.css({'overflow': 'auto'});
              updateScroll();

          };

      function updateScroll() {
        $.each( cache, function( i, v ) {
              // if we're past the link's section, activate it
              $v = $(v),
              $planetPosition =$(v.hash).position().left;
              if(lastscroll != scroll) {
                if (scroll >= $planetPosition && scroll < $planetPosition + $bodyWidth) {
                  if(lastscroll < scroll && last&&last.text() == $v.text()) {
                    $planetPosition = i < (cache.length -1) ? $planetPosition + $bodyWidth : 0;
                    $v.removeClass('active');
                    last = $(cache[(i + 1) % cache.length]).addClass('active');
                  } else {
                    last && last.removeClass('active');
                    last = $v.addClass('active');
                  }  
                  lastscroll = scroll; 
                  $scrollable.scrollLeft($planetPosition);
                  return false;
                } else {
                }
              }  
              
            });

            // all done
            clearTimeout( timeout );
            deferred = false;

      };
      // work on scroll, but debounced
      var $document = $(document).scroll( function() {

        // timeout hasn't been created yet
        if ( !deferred ) {
          timeout = setTimeout( check , 250 ); // defer this stuff
          deferred = true;
        }

      });
 
     // fix any possible failed scroll events and fix the nav automatically
      (function() {
        $document.scroll();
        setTimeout( arguments.callee, 1500 );
      })(); 
      
})();

