app = app or {}

app.main = {

	init: () ->
		resource_nodes['intro'].volume = 0.5
		resource_nodes['intro'].play()
		setTimeout((-> fade_out(resource_nodes['intro'])), 3000)

		hide('loading')
		app.menu.init()
		show('app')
		return

}