$(document).ready(function(){
	log('App ready');
	const host = location.origin.replace(/^http/, 'ws');
	const ws = new WebSocket(host);	
	const ds = {};
	var log_id=0;
	populate('#reader','readers');
	populate('#student','students');
	ws.onopen = function(){
		log('Socket Connected');
    }
    ws.onmessage = function (e) {
		var object = JSON.parse(e.data);
		if(object.message)
			log('Received: '+object.message);
	};
	 $('#student').change(function(){
    	var value = $(this).val();
    	var student =  ds.students[value];
    	var image = 'url('+student.picture+')';
    	console.log(value,ds.students,image);
    	$('.student-preview').css({'background-image':image});
    });

    $('.btn-send').click(function(e){
    	e.preventDefault();
    	var type = $(this).data('type');
    	sendMessage(type);
    });

    function sendMessage(type){
    	var reader = $('#reader').val();
    	var r_type =  $('#reader option:selected').data('type');
    	var student = $('#student').val();
    	var command = {type:type,reader:reader,student:student};
    		command =  JSON.stringify(command);
    	if(r_type == type){
	    	log('Sending ...');
	    	ws.send(command);
	    }else{
	    	log('ERR: Invalid action '+type.toUpperCase()+ ' for reader '+ reader);
	    }
    }

    function populate(elem,endpoint){
    	log('Loading '+endpoint+'.json ...');
    	ds[endpoint] = {};
    	$.getJSON('api/'+endpoint+'.json',function(objects){
    		log('Received: '+endpoint+'.json');
    		var optgrp="";
			for(var i in objects){
				var object = objects[i];
				var value =  object.id;
				var label =  object.name;
				var option =  $('<option/>').val(value).text(label);
				if(endpoint=='readers'){
					var type = object.type;
		    		optgrp = '>optgroup[label="'+type.toUpperCase()+'"]';
		    		option.data('type',type);
		    	}
				$(elem+optgrp).append(option);
				ds[endpoint][value]=object;
			}

		});
    }
    function log(text){
    	log_id++;
    	if(text.match(/ERR/)) alert(text);
    	$('#debugger>pre').append('<div id=""'+log_id+'"">'+text+'<div>');

    }
});