
function update_player_info () {
	var players = game.client_states.players;
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
	};
}

function update_world() {
	var cl_players = game.client_states.players;
	var srv_players = game.server_state.players;

	// movement
	for (var i = 0; i < cl_players.length; i++) {
		var cl_player = cl_players[i];
		var cl_actions = cl_player.actions;

		var srv_player = srv_players[i];

		var delta_x = 0;
		var delta_y = 0;
		if (cl_actions.left) {
			delta_x -= srv_player.speed;
		}
		if (cl_actions.right) {
			delta_x += srv_player.speed;
		}
		if (cl_actions.up) {
			delta_y -= srv_player.speed;
		}
		if (cl_actions.down) {
			delta_y += srv_player.speed;
		}
		if (cl_actions.bomb) {
		}

		srv_player.accel_x = (srv_player.accel_x + delta_x) / 2;
		srv_player.accel_y = (srv_player.accel_y + delta_y) / 2;
		srv_player.world_x += srv_player.accel_x;
		srv_player.world_y += srv_player.accel_y;
	}

	// collision detection
	for (var i = 0; i < srv_players.length; i++) {
		var srv_player = srv_players[i]
	}
	game_stats(1);
}

