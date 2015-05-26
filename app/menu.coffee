app = app or {}

app.menu = {

	init: ->
		app.menu.model = app.menu.init_model()
		listenOn("body", 'keydown', app.menu._on_menu_keypress)
		app.menu._set_menu_active('main')

	init_model: () ->
		_mk_option = (text, action) ->
			return {
				text: text,
				action: action
				active: m.prop(false)
			}

		return {
			'selected_menu': 'main'
			'selected_option_index': 0

			'menus': {
				'main': [
					_mk_option("NEW GAME", 'game')
					_mk_option("SETTINGS", 'settings')
					_mk_option("CREDITS", app.menu.roll_credits)
				]
				'game': [
					_mk_option("RANDOM GAME", app.game.start_random_game)
					_mk_option("NEW PRIVATE GAME", app.game.start_private_game)
					_mk_option("BACK", 'main')
				]
				'ingame': [
					_mk_option("NICK: HANSWURST")
					_mk_option("AUDIO: ON")
					_mk_option("EXIT", 'main', app.game.exit)
				]
				'settings': [
					_mk_option("NICK: HANSWURST")
					_mk_option("AUDIO: ON")
					_mk_option("BACK", 'main')
				]
			}

			# TODO (mb): use m.prop for nick and audio

		}

	_set_menu_active: (menu_id) ->
		model = app.menu.model
		cur_opt_idx = model.selected_option_index
		cur_menu = model.menus[model.selected_menu]
		cur_menu[cur_opt_idx].active(false)

		new_menu = model.menus[menu_id]
		model.selected_menu = menu_id
		cur_opt_idx = Math.min(cur_opt_idx, new_menu.length)
		new_menu[cur_opt_idx].active(true)

		app.menu.rerender()
		return

	_set_option_active: (menu_id, option_idx) ->
		model = app.menu.model
		cur_menu = model.menus[menu_id]

		return if option_idx == model.selected_option_index

		cur_menu[model.selected_option_index].active(false)
		model.selected_option_index = option_idx
		cur_menu[option_idx].active(true)
		app.menu.rerender()
		return

	_select_option: (menu_id, option_idx) ->
		cur_menu = app.menu.model.menus[menu_id]
		option = cur_menu[option_idx]
		if typeof option.action == 'string'
			app.menu._set_menu_active(option.action)
		else if option.action
			option.action()
		return

	_on_select_option: (menu_id, option_idx) ->
		return (e) ->
			app.menu._select_option(menu_id, option_idx)
			return

	_on_focus_option: (menu_id, option_idx) ->
		return (e) ->
			app.menu._set_option_active(menu_id, option_idx)
			return

	_on_menu_keypress: (e) ->
		keycode = e.which
		return if keycode not in [38, 40, 13]

		menu_id = app.menu.model.selected_menu
		option_idx = app.menu.model.selected_option_index

		switch keycode
			when 38 	# Up Arrow
				option_idx -= 1
			when 40 	# Down Arrow
				option_idx += 1
			when 13		# Enter
				app.menu._select_option(menu_id, option_idx)
				return

		cur_menu = app.menu.model.menus[menu_id]
		option_idx = Math.clamp(option_idx, 0, cur_menu.length - 1)

		app.menu._set_option_active(menu_id, option_idx)
		return

	_mk_option_node: (menu_id, option_idx, option) ->
		node = "div.menu-option"
		if option.active()
			node += ".active"
		return m(node, {
			'onclick': app.menu._on_select_option(menu_id, option_idx),
			'onmouseenter': app.menu._on_focus_option(menu_id, option_idx),
		}, option.text)

	_current_options: () ->
		menu_id = app.menu.model.selected_menu
		selected_options = for o_idx, option of app.menu.model.menus[menu_id]
			app.menu._mk_option_node(menu_id, o_idx, option)
		return selected_options

	rerender: () ->
		m.render(byId('app'), app.menu.view())
		return

	view: () ->
		return m("div.menu", {
			onkeypress: app.menu._on_menu_keypress
		}, app.menu._current_options())

	roll_credits: () ->
		console.log("roll credits")
}
