navigator.getUserMedia  = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia

window.recorder =
	init: ->
		_.bindAll(@)
		@outputting = false
		@$outputBox = $('#output-box')
		@context = new webkitAudioContext()
		@outputNode = @context.createJavaScriptNode(4096, 1, 1)
		@outputNode.onaudioprocess = @output
		@outputNode.connect @context.destination
		$(document).on 'click', '#start-recording', =>
			navigator.getUserMedia {audio: true}, @onSuccess, @onFail
		$(document).on 'click', '#playback', @playback
		$(document).on 'click', '#output', => @outputting = !@outputting
		$(document).on 'click', '#stop', =>
			@stream.stop() if @mediaStreamSource

	output: (event) ->
		if @outputting
			raw = event.inputBuffer.getChannelData(0)
			sum = 0
			sum += point for point in raw
			@$outputBox.prepend("<div class='bar' style='width: #{Math.abs(sum) * 40}px'></div>")

	onSuccess: (@stream) ->
		console.log "Streaming!", @stream
		@mediaStreamSource = @context.createMediaStreamSource(@stream)
		@mediaStreamSource.connect(@outputNode)

	onFail: (e) -> console.log "fail!", e

	playback: -> @mediaStreamSource.connect(@context.destination);

$ ->
	recorder.init()