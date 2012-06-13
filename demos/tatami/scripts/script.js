function init() {
	var s6 = document.getElementById('s6');
	var s8 = document.getElementById('s8');
	var s10 = document.getElementById('s10');
	var s12 = document.getElementById('s12');
	var f6 = document.getElementById('f6');
	var f8 = document.getElementById('f8');
	var f10 = document.getElementById('f10');
	var f12 = document.getElementById('f12');
	var room = document.getElementById('room');
	var normal = document.getElementById('normal');
	var fancy = document.getElementById('fancy');
	s6.addEventListener('click', function (s6) {
		s6.preventDefault();
		room.classList.add('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	s8.addEventListener('click', function (s8) {
		s8.preventDefault();
		room.classList.add('s8');
		room.classList.remove('s6');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	s10.addEventListener('click', function (s10) {
		s10.preventDefault();
		room.classList.add('s10');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	s12.addEventListener('click', function (s12) {
		s12.preventDefault();
		room.classList.add('s12');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	f6.addEventListener('click', function (f6) {
		f6.preventDefault();
		room.classList.add('f6');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f8');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	f8.addEventListener('click', function (f8) {
		f8.preventDefault();
		room.classList.add('f8');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f10');
		room.classList.remove('f12');
	}, false);
	f10.addEventListener('click', function (f10) {
		f10.preventDefault();
		room.classList.add('f10');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f12');
	}, false);
	f12.addEventListener('click', function (f12) {
		f12.preventDefault();
		room.classList.add('f12');
		room.classList.remove('s6');
		room.classList.remove('s8');
		room.classList.remove('s10');
		room.classList.remove('s12');
		room.classList.remove('f6');
		room.classList.remove('f8');
		room.classList.remove('f10');
	}, false);
	normal.addEventListener('click', function (normal) {
		normal.preventDefault();
		room.classList.add('normallayout');
		room.classList.remove('fancylayout');
	}, false);
	fancy.addEventListener('click', function (fancy) {
		fancy.preventDefault();
		room.classList.remove('normallayout');
		room.classList.add('fancylayout');
	}, false);
}
window.addEventListener('load', init, false);