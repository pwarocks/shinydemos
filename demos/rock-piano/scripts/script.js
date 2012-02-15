var body = document.body,
	keys = document.getElementById('keyboard').getElementsByTagName('li');

document.addEventListener('DOMContentLoaded', function() {
	for(var i=0, l=keys.length; i < l; i++) {
		var key = keys[i],
			name = key.id.replace('key-', '');
		var note = document.createElement('audio');
			note.preload = true;
			note.loop = true;
			note.id = 'note-' + name;
		var mp3 = document.createElement('source');
			mp3.src = 'media/' + name + '.mp3';
			mp3.type = 'audio/mpeg';
		var ogg = document.createElement('source');
			ogg.src = 'media/' + name + '.ogg';
			ogg.type = 'audio/ogg';		

		note.appendChild(mp3);
		note.appendChild(ogg);
		body.appendChild(note);

		note.load();

		key.onmousedown =
		key.onmouseup =
		key.ontouchstart =
		key.ontouchend = keyAction;
	}
}, false);

function keyAction(e, key) {
	var event = e.type,
		key = document.getElementById('key-' + key) || e.target,
		note = document.getElementById(key.id.replace('key-', 'note-'));
	if(note.paused) {
		note.play();
		key.classList.add('pressed');
	} else {
		if(event != 'keydown') {
			note.pause();
			key.classList.remove('pressed');
		}
	}
	e.preventDefault();
}

function keyHandler(e) {
	if(e.altKey || e.ctrlKey || e.metaKey) return;
	switch (e.which) {
		case 65: keyAction(e, '1-0'); break; // a
		case 87: keyAction(e, '1-5'); break; // w
		case 83: keyAction(e, '2-0'); break; // s
		case 69: keyAction(e, '2-5'); break; // e
		case 68: keyAction(e, '3-0'); break; // d
		case 70: keyAction(e, '4-0'); break; // f
		case 84: keyAction(e, '4-5'); break; // t
		case 71: keyAction(e, '5-0'); break; // g
		case 89: keyAction(e, '5-5'); break; // y
		case 72: keyAction(e, '6-0'); break; // h
		case 85: keyAction(e, '6-5'); break; // u
		case 74: keyAction(e, '7-0'); break; // j
	}
}

document.addEventListener('keydown', keyHandler, false);
document.addEventListener('keyup', keyHandler, false);