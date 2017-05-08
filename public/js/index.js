$(document).ready(function(){
	const host = location.origin.replace(/^http/, 'ws');
	const ws = new WebSocket(host);	
	const STUDENTS = {};
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
	$.getJSON('api/students.json',function(students){
		for(var i in students){
			var student = students[i];
			var id = student.id;
			STUDENTS[id] = student;
		}
	});
	ws.onopen = function(){
        ws.send('Connected');
      }
	ws.onmessage = function (e) {
		var object = JSON.parse(e.data);
		if(object.date)
			$('#date').text('Server:'+object.date);
		if(object.message){
			try{
				var json =  JSON.parse(object.message);
				execute(json);
			}catch(e){
				 $('#message').text(object.message);
			}
			
		}
	}
	function execute(command){
		var type =  command.type;
		var rid = command.reader;
		var sid =  command.student;
		var reader = $('#rdr-'+rid);
		var student = STUDENTS[sid];
		reader.css({'background-image': 'url(../'+student.picture+')'});
		reader.find('.sno').text(student.sno);
		reader.find('.student-name').text(student.name);
	}
});