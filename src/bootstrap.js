module.exports = function (){
	const express = require('express');
	const SocketServer = require('ws').Server;
	const path = require('path');

	const PORT = process.env.PORT || 3000;
	const INDEX = path.join(__dirname, 'views/index.html');
	const CLIENT = path.join(__dirname, 'views/client.html');
	const DASH = path.join(__dirname, 'views/dashboard.html');

	const app = express();
	app.use(express.static('public'));
	app.use(express.static('bower_components'));

	const server = app
	  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

	app.get('/',(req,res) => res.sendFile(INDEX) );
	app.get('/client',(req,res) => res.sendFile(CLIENT) );
	app.get('/dashboard',(req,res) => res.sendFile(DASH) );
	
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