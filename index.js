var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
//nforms Express where your template files are, 
//and which template engine to use. It all specifies the function that will process the template's code. 
app.get("/", function (req,res) {
	res.render("page");
});
app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port)); // passed the ExpressJS server to Socket.io. 
//In effect, our real time communication will still happen on the same port.

io.sockets.on('connection',function(socket) { //Every Socket.io application begins with a connection handler
	socket.emit('message', {message: 'Welcome to the web chat app!'});
	socket.on('send', function(data) {
		io.sockets.emit('message',data);
	});
});
/*The object, socket, which is passed to your handler, is actually the socket of the client. Think about it as a junction between your server and the user's browser. 
Upon a successful connection, we send a welcome type of message, and, of course, bind another handler that will be used as a receiver. 
As a result, the client should emit a message with the name, send, which we will catch. Following that, we simply forward the data sent by the user to all other sockets with io.sockets.emit. */
console.log("Listening on port: " + port);