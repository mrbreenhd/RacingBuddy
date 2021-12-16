const express = require('express');
const { set } = require('express/lib/application');
const http = require('http')
const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const fs = require('fs');

let rawdata = fs.readFileSync('server.json');
let server_data = JSON.parse(rawdata);

var usernames = {};


io.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.emit('log_user', `SERVER: Connected. Hello ${username}`);
    console.log(`${username} has connected`);
    socket.emit('speed', server_data.update);
  });

  socket.on('telemetry', function(data){
    console.log(`data received and sent`);
    io.sockets.emit('broadcast', data)
  })
  
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    console.log(`SERVER: ${socket.username} has disconnected`)

  });
});


console.clear();
io.listen(3000);