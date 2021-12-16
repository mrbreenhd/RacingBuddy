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

var usernames = {};


io.on('connection', function(socket) {
  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.emit('updatechat', `SERVER: Connected. Hello ${username}`);
    console.log(`${username} has connected`);
  });

  socket.on('telemetry', function(data){
    console.log(`data received and sent`);
    io.sockets.emit('broadcast', data)
  })
  
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    //socket.broadcast.emit('updatechat', `SERVER: ${socket.username} has disconnected`);
    console.log(`SERVER: ${socket.username} has disconnected`)

  });
});


console.clear();
io.listen(3000);