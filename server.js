/**
 * Server app script.
 */

const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const path = require('path');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', PORT);
app.set('view engine', 'pug');

app.use(morgan(':dev'));
app.use('/public', express.static(__dirname + '/public'));

server.listen(PORT, function() {
  console.log(`LISTENING ON PORT ${PORT}`);
});

// Game Server
const MyServerEngine = require(path.join(__dirname, 'src/server/MyServerEngine.js'));
const MyGameEngine = require(path.join(__dirname, 'src/common/MyGameEngine.js'));
const SimplePhysicsEngine = require('incheon').physics.SimplePhysicsEngine;

// Game Instances
const physicsEngine = new SimplePhysicsEngine();
const gameEngine = new MyGameEngine({ physicsEngine, traceLevel: 1 });
const serverEngine = new MyServerEngine(io, gameEngine, { debug: {}, updateRate: 6 });

// start the game
serverEngine.start();
