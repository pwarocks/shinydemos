var data, count = 0; 


var color = d3.scale.ordinal().range(colorbrewer.PRGn[11])

var tweetContainer = $('#tweet'); // Container to display tweets

var tweetContainerWidth = tweetContainer.outerWidth();

var containerWidth = document.body.clientWidth;

var containerHeight = document.body.clientHeight - 80;

var xy = d3.geo.mercator();
    xy.scale(containerWidth).translate([containerWidth/2, containerHeight/2 + 100]);

var path = d3.geo.path().projection(xy); // We want a huge map occupying whole screen

var svg = d3.select("#map").append("svg"); 

svg.attr("width", containerWidth)
   .attr("height", containerHeight); //OccupyViewPort

var countries = svg.append("g").attr("id", "countries");


d3.json("world-countries.json", function(json) {

   countries.selectAll("path")
            .data(json.features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", function(d) { return d.properties.name.split(' ').join('').toLowerCase(); })
            .attr("data-centroid", function(d) { return path.centroid(d).toString(); })          // Display tweet at the center of this country
            .attr("fill", function(d, i) { return color(i/json.features.length); });
 });

d3.json("tweets.json", function(tweets) {
  data = tweets;

  
  var displayTweetTimer = setInterval(function() {
    var tweet = data[count];

    var tweetCountry = d3.select("path#"+tweet["tweet-id"]);
    
    var tweetCoord = xy([tweet.location.x, tweet.location.y]);
   if(count > 0) {
      var prevCountry = d3.select("path#" + data[count - 1]["tweet-id"]);
      prevCountry.attr('fill', d3.hsl(prevCountry.attr('fill')).darker());
   } 
    tweetCountry.attr('fill', d3.hsl(tweetCountry.attr('fill')).brighter());
   tweetContainer.removeClass('show').delay(1000).queue(function() {
     if(containerWidth - tweetCoord[0] < tweetContainerWidth) {
       tweetContainer.css({
       'right': tweetContainerWidth + 'px',
       'top': tweetCoord[1] + 'px',
        'left': 'auto'
       });
     } else {
        tweetContainer.css({
          'left': tweetCoord[0] + 'px',
          'top': tweetCoord[1] + 'px',
         'right': 'auto' 
        });
     }

     tweetContainer.text(data[count]["tweet"]);
     
    
      count = count < data.length ? count + 1 : 0;

     tweetContainer.addClass('show');
     $(this).dequeue();
   });

  }, 5000);

});  


