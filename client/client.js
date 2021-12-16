const io = require("socket.io-client");
var irsdk = require('node-irsdk')
const fs = require('fs');

let rawdata = fs.readFileSync('user.json');
let user_data = JSON.parse(rawdata);

var iracing = irsdk.init({telemetryUpdateInterval: user_data.update})

var socket = io(`ws://${user_data.ip}:${user_data.port}`, {transports: ['websocket']});
socket.on('connect', function () {
  socket.emit('adduser', user_data.name);
});

socket.on('updatechat', function (data) {
  console.log(data);
});

iracing.on('Telemetry', function (evt) {
    socket.emit('telemetry',JSON.stringify(evt.values))
})

iracing.on('Connected', function () {
  socket.emit('sim_con', "Start")
  console.log("Sim Connected");
})

iracing.on('Disconnected', function () {
  socket.emit('sim_disc', "Stop")
  console.log("Sim Disconnected");
})



///////////////////ERRORS///////////////////////
socket.on("disconnect", (reason) => {
    console.log(`SERVER: ${reason}. attempting to reconnect`);
});

socket.on("connect_error", (error) => {
    console.log(`SERVER: Unable to connect. ${error}`);
});

socket.io.on("reconnect", (attempt) => {
  console.log(`Reconnecting...After ${attempt} attempt(s)`);
});

console.clear();