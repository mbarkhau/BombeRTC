// based on code by mrdoob / http://mrdoob.com/

(function() {
	function new_div(cls, parent) {
		var div = document.createElement('div');
		div.className = cls;
		if (parent) {
			parent.appendChild(div)
		}
		return div;
	}

	var stats_idx = 0;

	window.Stats = function (name) {
		name = name || "";
		var t0 = 0;
		var avg_ms = 0;
		var ms = 0;

		var container = new_div('stats');
		container.style.cssText = "top: " + (1 + 71 * stats_idx) + "px;";
		stats_idx += 1;
		var ms_div = new_div('stats_ms', container);
		var ms_text = new_div('stats_ms_text', ms_div);
		ms_text.innerHTML = 'MS';
		var ms_graph = new_div('stats_ms_graph', ms_div);

		while (ms_graph.children.length < 94) {
			ms_graph.appendChild(document.createElement('div'));
		}

		// TODO: auto adjusting scale
		document.body.appendChild(container);

		setInterval(function() {
			ms_text.textContent = Math.round(avg_ms) + " ms [" + name + "]";
			var child = ms_graph.appendChild(ms_graph.firstChild);

			var low_ms = Math.min(avg_ms, ms);
			var jtr_ms = Math.max(avg_ms, ms) - low_ms;

			var low_px = Math.round(50 - 50 * (low_ms / 100));
			var jtr_px = Math.min(50 - low_px, Math.round(50 * (jtr_ms / 100)));

			child.style.cssText = (
				"height: " + low_px + "px;" +
				"border-width: 0 0 " + jtr_px + "px;"
			);
		}, 50);

		return function(t) {
			if (t === 0) {
				t0 = now();
			} else {
				ms = now() - t0;
				avg_ms = (avg_ms + ms) / 2;
			}
		};
	};
})();