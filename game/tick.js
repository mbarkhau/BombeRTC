self.addEventListener('message', function (e) {
	var interval = parseFloat(e.data);
	var start = Date.now();
	var tick = 0;

	function tickLoop() {
		self.postMessage('tick: ' + tick);
		tick += 1;
		var tick_target_time = start + tick * interval;
		var wait = tick_target_time - Date.now();
		setTimeout(tickLoop, wait);
	}
	tickLoop();
}, false);