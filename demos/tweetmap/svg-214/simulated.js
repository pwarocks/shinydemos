(function() {
  var po = org.polymaps, tweets = [], count = 0, timeout = null, tweettext, location, tweetcontainer;

  var map = po.map()
      .container(document.getElementById('map').appendChild(po.svg('svg')))
      .center({lat: 51.28, lon: 0})
      .zoom(2);

  var svg = $('#map').find('svg');         
  svg[0].setAttribute('width', '100%');
  svg[0].setAttribute('height', '70%'); 

  svg.prepend($('<style>@import url(svg.css); </style>'));

  function manipulatemap(e) {
    for (var i = 0, L = e.features.length; i < L; i++) {
        var feature = e.features[i];
        var  hue = 29;
        var  sat = Math.round(Math.random()*99+1);
        var  lit = Math.round(Math.random()*60+20);
       feature.element.setAttribute("fill", 'hsl(' + hue + ", " + sat + '%, ' + lit + '%)');
       feature.element.setAttribute("id", feature.data.properties.name.toLowerCase().split(" ").join("_"))
     }
    
     tweetcontainer = po.svg('g'); 
     location = po.svg('circle');
     
     if(document.implementation.hasFeature("http://www.w3.org/Graphics/SVG/feature/1.2/#TextFlow", "1.2")) {
       tweettext = po.svg("textArea");
       tweettext.setAttribute("width", 300);
       tweettext.setAttribute("height", 200);        
     } else {
        tweettext = po.svg("text");
     }
     
     location.setAttribute('r', 5);  // set the radius for the circle

     tweetcontainer.setAttribute('class', 'tweet-container');
     tweetcontainer.appendChild(tweettext);
     tweetcontainer.appendChild(location);
          
     svg[0].appendChild(tweetcontainer);  
    
    map.resize();
    $.getJSON('tweets.json', twitterload);
  };


  map.add(po.geoJson()
      .url("world.json")
      .tile(false)
      .zoom(3)
      .on("load", manipulatemap));

  map.add(po.compass()
      .pan("none"));

  var twitterload = function(data) {
    tweets = data;
    showtwitter();
    timeout = setInterval(showtwitter, 6000);
  };


  var showtwitter = function(e) { 
    if(count < tweets.length) {
      svg.find('.tweet-container').fadeOut(1000);    
      loadmap(tweets[count]);
      count++;    
    } else {
      count = 0;
    }
  };


  var loadmap = function(tweet) {    
      var mappos = map.locationPoint({lat: tweet.location.y, lon: tweet.location.x});
      location.setAttribute('cx', mappos.x );
      location.setAttribute('cy', mappos.y);
      tweettext.setAttribute("x", (+mappos.x + 10));
      tweettext.setAttribute("y", (+mappos.y + 5)); 
      tweettext.firstChild && tweettext.removeChild(tweettext.firstChild); // remove old tweet if there is one
      tweettext.appendChild(document.createTextNode(tweet['tweet'])); //add the next tweet   
      $(tweetcontainer).hide().fadeIn(2000);                  
      
  };

  var showdot = function(e, tweet) {
    for(var i = 0, L = e.features.length; i < L; i++){
      var c= e.features[i].element;
      var x = e.features[i].data.geometry.coordinates.x;
      var y = e.features[i].data.geometry.coordinates.y;
      g = c.parentNode;
      g.setAttribute('class', 'tweet-container');

      $(g).fadeIn(2000);

      g.appendChild(tweetgraphic);
    }
  };
  
})();
