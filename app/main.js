
function init_game() {
	var canvas =  doc.getElementById('canvas');
	canvas.width = 650;
	canvas.height = 650;
	var map_id = 0;
	var tiles = TILES[map_id];

	render_ctx = {
		'tile_size': 50,
		'canvas_width': 650,
		'canvas_height': 650,
		'canvas': canvas,
		'canvas_ctx': canvas.getContext('2d'),
	};
	game = {
		'world_start': now(),   // This does not have to match up
								// between machines.

		'tick_start': 0,

		'player_id': 0,

		// Metadata of each player (nick, capabilities)
		'players': [
			{
				'nick': "player 1",
				'conn': null,
			},
			{
				'nick': "player 2",
				'conn': null,
			}
		],

		// This datastructure is sent at the beginning of the game.
		'map_state': {
			'tiles': tiles,
			'world_width': Math.sqrt(tiles.length),
			'world_height': Math.sqrt(tiles.length),
			'tick_duration': GAME_TICK_TIME,
		},

		// This datastructure is sent every tick to all players.
		// Any updates to player metadata/capabilities is also
		// stored/transmitted here.
		'server_state': {
			'tick': 0,
			'items': [],
			'players': [
				{
					'world_x': 1.5,
					'world_y': 1.5,
					'accel_x': 0,
					'accel_y': 0,

					'speed': 0.11,
					'max_bombs': 1,
					'bomb_radius': 1,
					'alive': true,
				},
				{
					'world_x': 11.5,
					'world_y': 11.5,
					'accel_x': 0,
					'accel_y': 0,

					'speed': 0.11,
					'max_bombs': 1,
					'bomb_radius': 1,
					'alive': true,
				}
			]
		},

		// This datastructure is sent every tick by each player.
		'client_states': {
			'players': [
				{
					'actions': {
					//	'up': false,
					//	'down': false,
					//	'left': false,
					//	'right': false,
					//	'bomb': false,
					}
				},
				{
					'actions': {
					//	'up': false,
					//	'down': false,
					//	'left': false,
					//	'right': false,
					//	'bomb': false,
					}
				}
			]
		}
	};

	function key_handler(e) {
		var keycode = e.which;
		var action = null;
		var cancel_action = null;
		switch (keycode) {
			case 37:
			case 65:
				action = 'left';
				cancel_action = 'right';
				break;
			case 38:
			case 87:
				action = 'up';
				cancel_action = 'down';
				break;
			case 39:
			case 68:
				action = 'right';
				cancel_action = 'left';
				break;
			case 40:
			case 83:
				action = 'down';
				cancel_action = 'up';
				break;
			case 32:
			case 13:
				action = 'bomb';
				break;
		}
		if (action) {
			var actions = game.client_states.players[game.player_id].actions;
			e.preventDefault();
 			if (e.type == 'keydown') {
				actions[action] = now();
				if (cancel_action) {
					delete actions[cancel_action];
				}
			} else if (e.type == 'keyup') {
				delete actions[action];
			}
		}
	}
	doc.body.addEventListener('keydown', key_handler);
	doc.body.addEventListener('keyup', key_handler);

	// Ticker is guaranteed to run at 30 fps,
	// even if the tab is put in the background
	var ticker = new Worker("app/tick.js");
	ticker.postMessage("" + GAME_TICK_TIME);
	ticker.addEventListener('message', game_loop)

	// render loop runs as fast as possible and
	// interpolates between network frames.
	render_loop();
}

function game_loop() {
	var t = now();

	// TODO: pause game if we haven't heard from a player
	game_stats(0);
	// update_player_info();
	update_world();
	game_stats(1);
	next_target_tick = game.tick + 1;

	net_stats(1);
	net_stats(0);
}

init_game();
