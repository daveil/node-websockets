'use strict';
const bs = require('./src/bootstrap');
const wss =  new bs();


setInterval(() => {
  var timeObj  ={date:new Date().toTimeString()};
  wss.broadcast(timeObj);
}, 1000);
