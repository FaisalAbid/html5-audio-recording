navigator.getUserMedia  = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia

recorder =
	init: ->
		@context = new webkitAudioContext()
		$(document).on 'click', '#start-recording', =>
			navigator.getUserMedia {audio: true}, @onSuccess, @onFail

	onSuccess: (stream) ->
		console.log "Streaming!", stream
		@mediaStreamSource = context.createMediaStreamSource(stream)

	onFail: (e) -> console.log "fail!", e

recorder.init