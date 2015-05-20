var win = window;
var doc = document;

function log() {
	var log = doc.getElementById('log');
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
		return win.setTimeout(cb, 16.6667);
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

function get_canvas_dim() {
	var dim = Math.min(win.innerWidth, win.innerHeight);
	return Math.floor(dim / 128) * 128;
}

function byId(id) {
	return doc.getElementById(id);
}

function elem(id_or_elem) {
	if (typeof id_or_elem == "string") {
		return byId(id_or_elem);
	}
	return id_or_elem;
}

function show(id_or_elem) {
	elem(id_or_elem).style['display'] = "block";
}

function hide(id_or_elem) {
	elem(id_or_elem).style['display'] = "none";
}

function setStyles(id_or_elem, styles) {
	var k, e = elem(id_or_elem);
	for (k in styles) {
		e.style[k] = styles[k];
	}
}

function listenOn(selector, event_name, callback) {
		var elems = doc.querySelectorAll(selector);
		for (var i = 0; i < elems.length; i++) {
			elems[i].addEventListener(event_name, callback);
		}
}