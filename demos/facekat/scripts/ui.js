/**
 * @author auduno / github.com/auduno
 * @constructor
 */
 
headtrackr.Ui = function() {

	var timeout;

	// create element and attach to body
	var messagep = document.getElementById('info');

	// function to call messages (and to fade them out after a time)
	this.setMessage = function(text) {
		window.clearTimeout(timeout);
		messagep.innerHTML = text;
		timeout = window.setTimeout(function() {messagep.innerHTML = ''; }, 3000);
	}
	
}