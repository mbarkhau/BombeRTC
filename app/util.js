win = window;

function log() {
	var log = document.getElementById('log');
	var child = log.insertBefore(log.lastChild, log.firstChild);
	child.textContent = Array.prototype.join.call(arguments, ", ");
}

var _now_t0 = 0;

function now() {
	return (
		window.performance ? performance.now() :
		Date.now ? Date.now() :
		+new Date() - _now_t0
	);
}
_now_t0 = now();

RAF = (
	win.requestAnimationFrame ||
	win.mozRequestAnimationFrame ||
	win.webkitRequestAnimationFrame ||
	win.msRequestAnimationFrame || function(cb) {
		return win.setTimeout(cb, 16.67);
	}
);

function mk_blob(len) {
	len = len || 16;
	var blob = [];
	for (var i = Math.round(len / 16) + 2; i--;) {
		blob.push(Math.random().toString(36).split(".")[1]);
	}
	return blob.join("").slice(0, len);
}
