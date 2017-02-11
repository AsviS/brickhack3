/**
 * This is the server app script that is run on the server.
 */

const DEV_MODE = process.argv.indexOf('--dev') != -1;
const PORT = process.env.PORT || 5000;
const FPS = 1000 / 60;

// Dependencies.
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const swig = require('swig');

const Game = require('./lib/Game');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = new Game();

app.set('port', PORT);
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/shared', express.static(__dirname + '/shared'));

app.get('/', function(request, response) {
  response.render('index');
});

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', function(socket) {
  // When a new player joins, the server adds a new player to the game.
  socket.on('new-player', function(data, callback) {
    game.addNewPlayer(data.name, socket);
    callback();
  });

  // Update the internal object states every time a player sends an intent
  // packet.
  socket.on('player-action', function(data) {
    game.updatePlayer(socket.id, data);
  });

  // When a player disconnects, remove them from the game.
  socket.on('disconnect', function() {
    var name = game.removePlayer(socket.id);
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  game.update();
  game.sendState();
}, FPS);

// Starts the server.
server.listen(PORT, function() {
  console.log(`STARTING SERVER ON PORT ${PORT}`);
});
