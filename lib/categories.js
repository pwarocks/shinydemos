//categories is an array of category objects:
/* 
[ 
{ tagName: 'css',
  displayName: 'CSS 3',
  tagline: 'CSS 3: CSS was co-invented by Opera\'s CTO, Håkon Wium Lie, so that Web pages could have beautiful designs. It started life as a method of specifying fonts and colours, and now provides simple animations, entire layouts and is the underpinning of Responsive Web Design.\nInspired to code? Read the <a href=\'http://dev.opera.com/articles/view/1-introduction-to-the-web-standards-cur/#toc\'>Web Standards Curriculum CSS tutorials</a> and <a href=\'http://dev.opera.com/articles/tags/css3\'>dev.O\'s CSS 3 articles</a>.' },
{ tagName: 'svg',
  displayName: 'SVG',
  tagline: 'You want scriptable text and images, that can be manipulated using their own DOM, CSS and script, in all modern browsers? You want to produce graphics that look sharp at phone screen size or widescreen TV size? And you want to be able to make them responsive too? Of course you do - so meet SVG: Scalable Vector Graphics. But you\'ll say \'Shiny! Very Groovy\'. And you\'d be right.\nInspired to code? Read Jeff Schiller\'s <a href=\'http://dev.opera.com/articles/view/svg-evolution-not-revolution/\'>SVG: Evolution, Not Revolution</a> and <a href=\'http://twitter.com/odevrel\'>tweet us</a> a link to your demo!</a>' } 
]
  
*/

exports.tagline = function(categories, tag) {
	var tagline;
	
	for (var i = 0, l = categories.length; i < l; i++){
		if (categories[i].tagName == tag){
			tagline = categories[i].tagline;
			break;
		}
	}
	return tagline;
}

exports.displayName = function(categories, tag) {
	var displayName;
	
	for (var i = 0, l = categories.length; i < l; i++){
		if (categories[i].tagName == tag){
			displayName = categories[i].displayName;
			break;
		}
	}
	return displayName;
}