navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var client = new BinaryClient('ws://localhost:4567');

client.on('open', function() {
	var streaming = false;
	var mediaStreamSource;
	var stream = client.createStream();
	var context = new webkitAudioContext();
	var outputNode = context.createJavaScriptNode(4096, 1, 1);
	var speex = new Speex({
	   	benchmark: false,
	  	quality: 2,
	  	complexity: 2,
	  	bits_size: 15
	});

	outputNode.onaudioprocess = function(event) {
		if (streaming) {
			var rawData = event.inputBuffer.getChannelData(0);
			var intArray = floatTo16BitArray(rawData);
			encodedData = speex.encode(intArray);
			console.log(encodedData);
			stream.write(intArray.buffer);
		}
	};

	outputNode.connect(context.destination);

	$(document).on('click', '#start-recording', function() {
		streaming = true;
	});

	navigator.getUserMedia({ audio: true }, function(s) { // success
			console.log("Streaming!");
			mediaStreamSource = context.createMediaStreamSource(s);
			mediaStreamSource.connect(outputNode);
		}, function(event) { // failure
			console.error(event);
		}
	);

	$('#stop').on('click', function() {
		console.log('Done!');
		stream.end();
		streaming = false;
	});
});

function floatTo16BitArray(input){
	var intArray = new Int16Array(input.length);
  for (var i = 0; i < input.length; i++){
  	if (Math.abs(input[i]) > 1) console.log(input[i]);
    var s = Math.max(-1, Math.min(1, input[i]));
    intArray[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return intArray;
}