
function init_game() {
	// TODO(mb): max tile size?
	var dim = get_canvas_dim();
	var canvas =  byId('canvas');
	canvas.width = dim;
	canvas.height = dim;
	show("canvas")
	hide("overlay")
	var map_id = 0;
	var tiles = TILES[map_id];

	render_ctx = {
		'tile_size': dim / 13,
		'canvas_width': dim,
		'canvas_height': dim,
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
			case 37: // Up Arrow
			case 65: // A
				action = 'left';
				cancel_action = 'right';
				break;
			case 38: // Up Arrow
			case 87: // W
				action = 'up';
				cancel_action = 'down';
				break;
			case 39: // Right Arrow
			case 68: // D
				action = 'right';
				cancel_action = 'left';
				break;
			case 40: // Down Arrow
			case 83: // S
				action = 'down';
				cancel_action = 'up';
				break;
			case 32: // Space
			case 13: // Enter
				action = 'bomb';
				break;
			case 16: // Shift
				action = 'kick';
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

var MENU_STATE = {
	'active': false,
	'active_menu': "main-menu",
	'active_option': 0,
}

function menu_key_handler(e) {
	console.log("keydown", e);
}

function menu_focus (e) {
	console.log("focus", e);
}

function menu_select (e) {
	console.log("select", e);
}

function init () {
	var dim = get_canvas_dim();
	var container = byId("container")
	setStyles("container", {
		'width': dim + "px",
		'height': dim + "px",
		'margin-top': ((win.innerHeight - dim) / 2) + "px",
	});
	win.addEventListener('load', function () {
		MENU_STATE.active = true;
		listenOn("body", 'keydown', menu_key_handler);
		listenOn(".menu-option", 'mouseover', menu_focus);
		listenOn(".menu-option", 'click', menu_select);
		show("menu");
		hide("loading");
	}, false);
}

init();
