$(document).ready(function(){
	const host = location.origin.replace(/^http/, 'ws');
	const ws = new WebSocket(host);	
	$.getJSON('api/readers.json',function(readers){
		var panel = $('#panel-template>li');
		
		for(var i in readers){
			var reader =  readers[i];
			var display =  panel.clone();
			display.find('.reader-name').text(reader.name);
			display.find('.sno').text('###');
			display.find('.student-name').text('---');
			display.attr('id','rdr-'+reader.id);
			$('#panel-'+reader.type).append(display);
		}
	});
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