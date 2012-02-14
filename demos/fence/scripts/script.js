var sign = document.getElementById('sign'),
	body = document.body;

function openFence(e) {
	var name = body.className;
	body.className = (name.indexOf('opened')+1) ?
		name.replace(' opened', '') :
		name += ' opened';
	e.preventDefault();
}

sign.addEventListener('click', openFence, false);
sign.addEventListener('touchstart', openFence, false);