

function update_world() {
	var player = game.players[game.player_id];
	var as = game.inputs;

	if (as.up) {
		player.actions.push('up');
	}
	if (as.down) {
		player.actions.push('down');
	}
	if (as.left) {
		player.actions.push('left');
	}
	if (as.right) {
		player.actions.push('right');
	}
	if (as.bomb) {
		player.actions.push('bomb');
		as.bomb = false;
	}

	// movement
	for (var i = 0; i < game.players.length; i++) {
		var delta_x = 0;
		var delta_y = 0;
		var player = game.players[i];
		for (var j = 0; j < player.actions.length; j++) {
			switch (player.actions[j]) {
				case 'left':
					delta_x -= player.speed;
					break;
				case 'right':
					delta_x += player.speed;
					break;
				case 'up':
					delta_y -= player.speed;
					break;
				case 'down':
					delta_y += player.speed;
					break;
			}
		}
		player.actions.length = 0;

		player.accel_x = (player.accel_x + delta_x) / 2;
		player.accel_y = (player.accel_y + delta_y) / 2;
		player.world_x += player.accel_x;
		player.world_y += player.accel_y;
	}

	// collision detection
	for (var i = 0; i < game.players.length; i++) {
		var player = game.players[i]

	}
	game_stats(1);
}


function init_game() {
	var canvas =  document.getElementById('canvas');
	canvas.width = 650;
	canvas.height = 650;

	game = {
		'world_width': 13,
		'world_height': 13,
		'tile_size': 50,
		'canvas_width': 650,
		'canvas_height': 650,
		'canvas': canvas,
		'render_ctx': canvas.getContext('2d'),
		'world_start': now(),   // This does not have to match up
								// between machines.
		'tick': 0,
		'tick_start': 0,
		'tick_duration': 16,
		'tiles': [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1,
			1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1,
			1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1,
			1, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
			// "#############",
			// "#  ++       #",
			// "# # #+# # # #",
			// "#  ++       #",
			// "#+#+# # # # #",
			// "#+++        #",
			// "#+#+# # # # #",
			// "# +++       #",
			// "# #+# # # # #",
			// "#           #",
			// "# # # # # # #",
			// "#           #",
			// "#############"
		],
		'items': [],
		'player_id': 0,
		'inputs': {
			'up': false,
			'down': false,
			'left': false,
			'right': false,
			'bomb': false,
			'mouse_x': -1,
			'mouse_y': -1,
		},
		'players': [
			{
				'nick': "player 1",
				'conn': null,
				'world_x': 1.5,
				'world_y': 1.5,
				'accel_x': 0,
				'accel_y': 0,
				'actions': [],
				'speed': 0.1,
				'bombs': 1,
				'bomb_radius': 1
			},
			{
				'nick': "player 2",
				'conn': null,
				'world_x': 11.5,
				'world_y': 11.5,
				'accel_x': 0,
				'accel_y': 0,
				'actions': [],
				'speed': 0.1,
				'bombs': 1,
				'bomb_radius': 1
			},
		]
	};

	function key_handler(e) {
		var keycode = e.which;
		var action = null;
		switch (keycode) {
			case 37:
			case 65:
				action = 'left';
				break;
			case 38:
			case 87:
				action = 'up';
				break;
			case 39:
			case 68:
				action = 'right';
				break;
			case 40:
			case 83:
				action = 'down';
				break;
			case 32:
			case 13:
				action = 'bomb';
				break;
		}
		if (action) {
			e.preventDefault();
 			if (e.type == 'keydown') {
				game.inputs[action] = now();
			} else if (e.type == 'keyup' && action != 'bomb') {
				game.inputs[action] = false;
			}
		}
	}
	document.body.addEventListener('keydown', key_handler);
	document.body.addEventListener('keyup', key_handler);
	var pix_node = document.getElementById('pix');

	function mouse_handler(e) {
		game.inputs.mouse_x = e.clientX;
		game.inputs.mouse_y = e.clientY;
		pix_node.style.cssText = (
			"top: " + (e.clientY - 7) + "px; left: " + (e.clientX - 50) + "px;"
		);
	}
	canvas.addEventListener('mousemove', mouse_handler);

	game_loop();
	render_loop();
}

function game_loop() {
	var t = now();
	var td = t - game.tick_start;

	var target_tick = Math.round((t - game.world_start) / GAME_TICK_TIME);
	var next_target_tick = target_tick;
	if (game.tick < target_tick) {
		// TODO: delay tick if we are waiting on network
		game.tick_start = t;
		game.tick += 1;

		game_stats(0);
		update_world();
		game_stats(1);
		next_target_tick = game.tick + 1;
	}

	net_stats(1);
	net_stats(0);
	var next_target_t = game.world_start + next_target_tick * GAME_TICK_TIME;
	setTimeout(game_loop, next_target_t - t);
}

init_game();

// TODO: watch for lost connection