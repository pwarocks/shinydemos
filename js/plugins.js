
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


$(function() {
  var demos = {
  "parser": "ff sa ch op ie",
  "canvas": "op ff sa"
  },
  scalable = $('#container'),
  zoomin = function() {    
      $('body').addClass('zoomedin');
  },
  zoomout = function() {
    $('body').removeClass('zoomedin');
  },
  iframe = $('.demo iframe'),
  browsers = $('#browsersupport');
      
  if(window.location.hash) { zoomin(); }
  $('#main > a').click(function(e) { 
    var demoid = /\/([^\/]*)\.html$/g.exec(this.href);
    iframe[0].src = this.href;
    browsers.addClass(demos[demoid[1]]);
    zoomin(); 
    e.preventDefault(); 
  });
  $('.infobar > a').click(function(e) { zoomout(); });
  
});