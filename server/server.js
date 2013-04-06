var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

// Start Binary.js server
var server = BinaryServer({ port: 4567 });
console.log('BinaryServer is listening on port 4567...');

eval(fs.readFileSync('../speex.min.js', 'utf8'));
console.log(util);

server.on('connection', function(client) {
	// Incoming stream from browsers
	client.on('stream', function(stream, meta) {
		var file = fs.createWriteStream(__dirname + '/audio.pcm');

		stream.on('data', function(chunk) {
			file.write(chunk);
		});

		stream.on('end', function(data) {
			console.log('Ended!');
			file.end();
		});
	});
});