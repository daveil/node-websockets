module.exports = function (){
	const express = require('express');
	const SocketServer = require('ws').Server;
	const path = require('path');

	const PORT = process.env.PORT || 3000;
	const INDEX = path.join(__dirname, '../index.html');

	const app = express();
	app.use(express.static('public'));
	app.use(express.static('bower_components'));

	const server = app
	  .use((req, res) => res.sendFile(INDEX) )
	  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

	const  wss = new SocketServer({ server });
	wss.on('connection', (ws) => {
		  console.log('Client connected');
		  
		  ws.on('close', () => console.log('Client disconnected'));
		  ws.on('message', function onReceived(message) {
		    var messageObj = {message:message};
			broadcast(messageObj);
		});
	 });
	function broadcast(data){
		wss.clients.forEach((client) => {
		    client.send(JSON.stringify(data));
		  });
	}
	var socket = {broadcast:broadcast};
	return socket;
}