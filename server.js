'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const app = express();
app.use(express.static('public'));
app.use(express.static('bower_components'));

const server = app
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach((client) => {
    	 console.log('client: %s', client);
    	var messageObj = {message:message};
	    client.send(JSON.stringify(messageObj));
	  });
  });
});



setInterval(() => {
  wss.clients.forEach((client) => {
  	var timeObj  ={date:new Date().toTimeString()};
    client.send(JSON.stringify(timeObj));
  });
}, 1000);
