app = app or {}

app.game = {

	start_random_game: () ->
		console.log("start_random_game")
		app.menu.hide()
		app.game.show()
		return

	start_private_game: () ->
		console.log("start_private_game")
		return

	exit: () ->
}