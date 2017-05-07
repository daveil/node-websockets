$(document).ready(function(){
	const host = location.origin.replace(/^http/, 'ws');
	const ws = new WebSocket(host);	
	  ws.onopen = function(){
        ws.send('Connected');
      }
	ws.onmessage = function (e) {
		var object = JSON.parse(e.data);
		if(object.date)
			$('#date').text('Server:'+object.date);
		if(object.message)
			$('#message').text(object.message);
		
	}
});