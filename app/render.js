
function render() {
	// TODO: interpolate player positions
	var ctx = game.render_ctx;
	ctx.fillStyle = 'rgb(255, 0, 255)';
	ctx.fillRect(0, 0, game.canvas_width, game.canvas_height);

	for (var i = 0; i < game.tiles.length; i++) {
		var tile = game.tiles[i];
		var tsize = game.tile_size;
		var world_x = i % game.world_width;
		var world_y = Math.floor(i / game.world_height);
		var render_x = world_x * game.tile_size;
		var render_y = world_y * game.tile_size;
		switch (tile) {
			case 0: // free
				ctx.fillStyle = 'rgb(50, 200, 50)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
			case 1: // solid
				ctx.fillStyle = 'rgb(50, 50, 50)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
			case 2: // destructable
				ctx.fillStyle = 'rgb(150, 150, 150)';
				ctx.fillRect(render_x, render_y, tsize, tsize);
				break
		}
	};

	for (var i = 0; i < game.players.length; i++) {
		var player = game.players[i];
		var render_x = player.world_x * tsize;
		var render_y = player.world_y * tsize;
		var psize = tsize / 2;
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