var body = document.body,
	video = document.getElementById('video'),
	lcd = document.getElementById('lcd'),
	keys = document.querySelectorAll('#keyboard button'),
	sounds = [], media = 'http://media.shinydemos.com/hixie-keyboard/';

document.addEventListener('DOMContentLoaded', function() {
	for(var i=0, l=keys.length; i<l; i++) {
		var key = keys[i],
			name = key.id.split('-')[1];
		var sound = document.createElement('audio');
			sound.preload = true;
			sound.id = 'sound-' + name;
			sounds[i] = sound;
		var mp3 = document.createElement('source');
			mp3.src = media + name + '.mp3';
			mp3.type = 'audio/mpeg';
		var ogg = document.createElement('source');
			ogg.src = media + name + '.ogg';
			ogg.type = 'audio/ogg';

		sound.appendChild(mp3);
		sound.appendChild(ogg);
		body.appendChild(sound);

		sound.load();

		key.onmousedown =
		key.ontouchstart = keyAction;
	}
}, false);

function keyAction(e, name) {
	var key = (name) ? document.getElementById('key-' + name) : e.target,
		sound = document.getElementById('sound-' + key.id.split('-')[1]);
	if(allPaused()) {
		key.classList.add('pressed');
		video.currentTime = 0;
		sound.play();
		video.play();
		lcd.innerText = key.dataset.text;
	}
	sound.addEventListener('ended', function() {
		key.classList.remove('pressed');
		video.pause();
		lcd.innerText = '_';
	}, false);
	e.preventDefault();
}

function allPaused() {
	for(var i=0, l=sounds.length; i<l; i++) {
		if(!(sounds[i].paused || sounds[i].ended)) return false;
	}
	return true;
}

function keyHandler(e) {
	if(e.altKey || e.ctrlKey || e.metaKey) return;
	var name;
	switch (e.which) {
		case 81: name = 'q'; break;
		case 87: name = 'w'; break;
		case 69: name = 'e'; break;
		case 82: name = 'r'; break;
		case 84: name = 't'; break;
		case 89: name = 'y'; break;
		case 85: name = 'u'; break;
		case 73: name = 'i'; break;
		case 79: name = 'o'; break;
		case 80: name = 'p'; break;
		case 65: name = 'a'; break;
		case 83: name = 's'; break;
		case 68: name = 'd'; break;
		case 70: name = 'f'; break;
		case 71: name = 'g'; break;
		case 72: name = 'h'; break;
		case 74: name = 'j'; break;
		case 75: name = 'k'; break;
		case 76: name = 'l'; break;
		case 90: name = 'z'; break;
		case 88: name = 'x'; break;
		case 67: name = 'c'; break;
		case 86: name = 'v'; break;
		case 66: name = 'b'; break;
		case 78: name = 'n'; break;
		case 77: name = 'm'; break;
		default: return;
	}
	keyAction(e, name);
}

document.addEventListener('keydown', keyHandler, false);