navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var client = new BinaryClient('ws://localhost:4567');

client.on('open', function() {
	var streaming = false;
	var mediaStreamSource;
	var stream = client.createStream();
	var context = new webkitAudioContext();
	var outputNode = context.createJavaScriptNode(4096, 1, 1);

	outputNode.onaudioprocess = function(event) {
		if (streaming) {
			stream.write(event.inputBuffer.getChannelData(0).buffer);
		}
	};

	outputNode.connect(context.destination);

	$(document).on('click', '#start-recording', function() {
		navigator.getUserMedia(
			{ audio: true },
			function(s) { // success
				console.log("Streaming!");
				mediaStreamSource = context.createMediaStreamSource(s);
				mediaStreamSource.connect(outputNode);
				streaming = true;
			}, function(event) { // failure
				console.error(event);
			}
		);
	});

	$('#stop').on('click', function() {
		console.log('Done!');
		stream.end();
		streaming = false;
	});
});