(function() {
      var scrollpage = document.getElementById('scrollpage'),
          scrollwrap = document.getElementById('scrollwrap'),
          sections = scrollpage.querySelectorAll('section'),
          navsections = scrollpage.querySelectorAll('section > h2'),
          style = document.createElement('style'),
          styles = [],
          numsections = sections.length,
          clickcount = 0,
          prefixes = ' -o- -webkit- -moz- -ms- '.split(' '),          
          aside = document.createElement('aside'), 
          currentwidth = window.innerWidth,
          asidelinks = aside.childNodes,
          lnk, prevscroll, currentscroll, clickevent;
      
      styles.push('#scrollpage section { width: ' + currentwidth + 'px; }');
      
      for(i = 0; i < numsections; i++) {
        styles.push('.parent' + i + ' { ' + prefixes.join( 'transform: translate(' + i*currentwidth + 'px, 0);') + '}');
        styles.push('.page' + i + ' { ' + prefixes.join( 'transform: translate(-' + i*currentwidth + 'px, 0);') + '}');        
        lnk = document.createElement('a');
        if(i == 0) { lnk.classList.add('active'); } 
        lnk.href='#';
        lnk.onclick = function (i) { return function (e) { 
          changePage(i);
          e.preventDefault(); 
        };  }(i);
        lnk.appendChild(document.createTextNode(navsections[i].textContent));
        aside.appendChild(lnk);
      }
      

      document.body.appendChild(aside);   
      style.textContent = styles.join(' ');
      document.head.appendChild(style);
      
      function scrollupdate() {
          currentscroll = document.documentElement.scrollLeft || document.body.scrollLeft;
          if(prevscroll) {   
            if(currentscroll > prevscroll || clickcount == 0) {
              changePage('next');          

            } else {
              changePage('prev');

            }            
          } else {
            changePage(Math.floor(currentscroll/currentwidth));
          }
          
            prevscroll = currentscroll;                                
 
      }
      
      scrollupdate();
      
      var throttledscroll = Cowboy.throttle(500, true, scrollupdate);

      document.addEventListener('scroll', throttledscroll, false);  
      
      function changePage(opt) {
        switch(opt) {
          case 'prev':
            clickcount = clickcount > 0 ? (clickcount - 1) : numsections - 1;         
            break;
          case 'next':
            clickcount = clickcount < (numsections - 1) ? (clickcount + 1) : 0;         
            break;
          default:
            clickcount = opt;
        }

        scrollpage.className = "page" + clickcount;           

        document.removeEventListener('scroll', throttledscroll, false);  
        if(document.documentElement.scrollLeft != undefined) { 
          document.documentElement.scrollLeft = clickcount * currentwidth; 
        } else {
          document.body.scrollLeft = clickcount * currentwidth; 
        }  
        document.addEventListener('scroll', throttledscroll, false);           

                        
        scrollwrap.className = "parent" + clickcount;
        
        for(var i = 0, len = asidelinks.length; i < len; i++) {
          asidelinks[i].classList.remove('active');
        }
        asidelinks[clickcount].classList.add('active');
      };
      
   
    })();

