win = window
doc = document

log = () ->
	log = doc.getElementById('log')
	child = log.insertBefore(log.lastChild, log.firstChild)
	child.textContent = Array.prototype.join.call(arguments, ", ")

now = (() ->
	if win.performance
		return (-> performance.now())
	if Date.now
		return (-> Date.now())
	return (-> +new Date() - (_now_t0 or 0))
)()

_now_t0 = now()

RAF = (
	win.requestAnimationFrame or
	win.mozRequestAnimationFrame or
	win.webkitRequestAnimationFrame or
	win.msRequestAnimationFrame or (cb) -> win.setTimeout(cb, 16.6667)
)

mk_blob = (len) ->
	len = len || 16
	blob = []
	for i in [Math.round(len / 16) + 2..0] by -1
		blob.push(Math.random().toString(36).split(".")[1])

	return blob.join("").slice(0, len)

get_canvas_dim = () ->
	dim = Math.min(win.innerWidth, win.innerHeight)
	return Math.floor(dim / 128) * 128

byId = (id) -> doc.getElementById(id)

elem = (id_or_elem) ->
	if (typeof id_or_elem == "string")
		return byId(id_or_elem)
	return id_or_elem

show = (id_or_elem) ->
	elem(id_or_elem).style['display'] = "block"
	return

hide = (id_or_elem) ->
	elem(id_or_elem).style['display'] = "none"
	return

setStyles = (id_or_elem, styles) ->
	e = elem(id_or_elem)
	for k of styles
		e.style[k] = styles[k]
	return

listenOn = (selector, event_name, callback) ->
	elems = doc.querySelectorAll(selector)
	for i in [0...elems.length]
		elems[i].addEventListener(event_name, callback)
	return

volume_fade = (audio_node, target_volume, duration, steps=8) ->
	start_volume = audio_node.volume
	step = (target_volume - start_volume) / steps
	limit_fn = if step < 0 then Math.max else Math.min
	step_fn = ->
		audio_node.volume = limit_fn(audio_node.volume + step, target_volume)
		return if audio_node.volume == target_volume
		setTimeout(step_fn, duration / steps)
	step_fn()
	return

fade_out = (audio_node, duration=2000) -> volume_fade(audio_node, 0, duration)
fade_in = (audio_node, duration=2000) -> volume_fade(audio_node, 1, duration)

Math.clamp = (val, min, max) -> Math.min(Math.max(val, min), max)