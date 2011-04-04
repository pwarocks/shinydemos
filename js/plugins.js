
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// place any jQuery/helper plugins in here, instead of separate, slower script files.

$(function() {
  var scalable = $('#container'),
  zoomin = function() {    
      $('body').addClass('zoomedin');
  },
  zoomout = function() {
    $('body').removeClass('zoomedin');
  };
    
  if(window.location.hash) { zoomin(); }
  $('#main > a').click(function() { zoomin(); });
  $('.infobar > a').click(function(e) { zoomout(); });
  scalable.bind('webkitTransitionEnd', function() {
  });
  
  /* PARSER DEMO */
  var preparse = "Remember the days when just forgetting to close a paragraph tag would cause nightmares? Fear no more, now with the new parsing algorithm, <i>eve <b>ry</i> browser</b> renders these missing elements in the same manner.";
  var addmark = function(parsedstring) {
    return parsedstring.replace(/(<)([^<>]*)(>)/g, "&lt;$2&gt;").replace(/(&lt;.*&gt;)/g, "<mark>$1</mark");
  };
  var empty = $('<div/>');
  empty.html(preparse);
  $('#parser .parsing').text(preparse);
  preparse = addmark($('#parser .parsing').text());
  $('#parser .parsing').html(preparse);
  $('#parser .result').text(empty.html());
  $('#parser .result').html(addmark($('#parser .result').text()));
});