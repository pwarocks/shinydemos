var sign = document.getElementById('sign'),
	body = document.body;

function openFence(e) {
	document.body.classList.toggle('opened');
	e.preventDefault();
}

sign.addEventListener('click', openFence, false);
sign.addEventListener('touchstart', openFence, false);