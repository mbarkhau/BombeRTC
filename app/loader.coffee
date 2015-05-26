
# TODO (mb): check browser compatability
# TODO (mb): fallback to mp3
# TODO (mb): loop = true for music audio nodes
# TODO (mb): set media/mimeype
# TODO (mb): select resource array based on domain

dev_resources = [
	"/assets/music/intro.opus"
	"/assets/music/game_game.opus"
	"/assets/music/lava_city.opus"
	"/assets/Bomb.png"

	# "/game/net.js"
	# "/game/tick.js"
	# "/game/globals.js"

	"/app/game.js"
	"/app/menu.js"
	"/app/app.js"

	"/lib/util.js"
	"/lib/kson.js"
	"/lib/mithril.js"

	"/style/menu.css"
	"/style/layout.css"
	"/style/loading.css"
	"/style/reset.css"
]

prod_resources = [
	"/assets/music/intro.opus"
	"/assets/music/game_game.opus"
	"/assets/music/lava_city.opus"
	"/assets/Bomb.png"

	"/app/app.min.js"

	"/lib/util.js"
	"/lib/kson.min.js"
	"//cdnjs.cloudflare.com/ajax/libs/mithril/0.2.0/mithril.min.js"

	"/style/menu.css"
	"/style/layout.css"
	"/style/loading.css"
]

resource_nodes = {}
doc = document

byId = (id) -> doc.getElementById(id)

window.onload = () ->
	start = Date.now()
	progress = byId("progress")
	resourcesNode = byId("resources")
	resource_paths = dev_resources

	mk_load_cb = (path, node) ->
		return () ->
			progressElem = doc.createElement("div")
			progressElem.innerText = path
			progress.insertBefore(progressElem, progress.firstChild)
			if progress.childNodes.length == resource_paths.length
				# hide("loading")
				app.main.init()
			return

	for path in resource_paths
		parts = path.split("/").slice(-1)[0].split(".")
		name = parts[0]
		type = parts.slice(-1)[0]
		switch type
			when 'js'
				node = doc.createElement("script")
				node.src = path
				node.onload = mk_load_cb(path, node)
				resourcesNode.appendChild(node)
			when 'css'
				node = doc.createElement("link")
				node.rel = "stylesheet"
				node.type = "text/css"
				node.href = path
				node.onload = mk_load_cb(path, node)
				resourcesNode.appendChild(node)
			when 'jpg', 'png'
				node = new Image()
				node.src = path
				node.onload = mk_load_cb(path, node)
			when 'opus', 'mp3', 'ogg'
				node = new Audio()
				node.src = path
				node.preload = true
				node.addEventListener('canplaythrough', mk_load_cb(path, node))

		resource_nodes[name] = node
