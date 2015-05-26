
function render() {
	// TODO(mb): interpolate player positions between game ticks
	var ctx = render_ctx.canvas_ctx;
	ctx.fillStyle = 'rgb(255, 0, 255)';
	ctx.fillRect(0, 0, game.canvas_width, game.canvas_height);

	var tsize = render_ctx.tile_size;
	var psize = tsize / 2;

	var map = game.map_state;
	var tiles = map.tiles;
	var world_w = map.world_width;
	var world_h = map.world_height;
	for (var i = 0; i < tiles.length; i++) {
		var world_x = i % world_w;
		var world_y = Math.floor(i / world_h);
		var render_x = world_x * tsize;
		var render_y = world_y * tsize;
		switch (tiles[i]) {
			case 0: // empty/grass
				ctx.fillStyle = 'rgb(50, 200, 50)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
			case 1: // solid
				ctx.fillStyle = 'rgb(17, 17, 17)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
			case 2: // destructable
				ctx.fillStyle = 'rgb(120, 120, 120)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
		}
	};

	var srv_players = game.server_state.players;

	for (var i = 0; i < srv_players.length; i++) {
		var player = srv_players[i];
		var render_x = player.world_x * tsize;
		var render_y = player.world_y * tsize;
		ctx.fillStyle = 'rgb(50, 50, 200)';
		ctx.fillRect(render_x - psize / 2, render_y - psize / 2, psize, psize);
	};
}

function render_loop() {
	render_stats(0);
	render();
	render_stats(1);
	RAF(render_loop);
}