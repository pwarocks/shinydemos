//todo add touch support.
//grow it a little bit?

var viking     = document.querySelector('svg'),
    serializer = new XMLSerializer(),
    cache      = {},
    tooltip    = (function(){
                    var tip = document.createElement('div');
                    tip.classList.add('tooltip');
                    document.body.appendChild(tip);
                    return tip;
                  }());

function cleanUp(string) {
  return string.replace(/xmlns=\".+\"/, '');
}

function createTooltip(el, event) {
    tooltip.innerText = el; 
    tooltip.style.top  = getTop(event);
    tooltip.style.left = getLeft(event);
}

function getTop(event) {      
  if (event.clientY < (window.innerHeight / 2)) {
    tooltip.className = 'tooltip top';
    return event.pageY + 15 + "px";
  } else {
    tooltip.className = 'tooltip bottom';
    return event.pageY - 44 - parseInt(getComputedStyle(tooltip).height, 10) + "px";
  }
}

function getLeft(x) {
  return x.pageX - ((parseInt(getComputedStyle(tooltip).width, 10) / 2) + 15) + "px";
}
  
function showElement(event) {
  //fails in firefox due to lack of correspondingElement support, https://bugzilla.mozilla.org/show_bug.cgi?id=485172
  //leave a comment in that bug when this is hosted somewhere.
  var  el = serializer.serializeToString(event.target.correspondingElement);
      
  if (cache[el]) {
    createTooltip(cache[el], event);
  } else {
    cache[el] = cleanUp(el);
    createTooltip(cache[el], event);
  }
}

viking.addEventListener('click', function(event){
  if (event.target.nodeName === "svg") {
    return;
  } else {
    showElement(event);
  }
});
