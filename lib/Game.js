/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const HashMap = require('hashmap');

const Entity = require('./Entity');
const Explosion = require('./Explosion');
const Bomb = require('./Bomb');
const Player = require('./Player');

const Constants = require('../shared/Constants');
const Util = require('../shared/Util');

function bind(context, method) {
  return function() {
    return method.apply(context, arguments);
  };
}

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects
 * in the game.
 * @constructor
 */
function Game() {
  /**
   * This is a hashmap containing all the connected socket ids and socket
   * instances as well as the packet number of the socket and their latency.
   */
  this.clients = new HashMap();

  /**
   * This is a hashmap containing all the connected socket ids and the players
   * associated with them. This should always be parallel with sockets.
   */
  this.players = new HashMap();

  /**
   * These arrays contain entities in the game world. They do not need to be
   * stored in a hashmap because they do not have a unique id.
   * @type {Entity}
   */
  this.bombs = [];
  this.explosions = [];
}

/**
 * Creates a new player with the given name and ID.
 * @param {string} name The display name of the player.
 * @param {Object} socket The socket object of the player.
 */
Game.prototype.addNewPlayer = function(name, socket) {
  this.clients.set(socket.id, socket);
  this.players.set(socket.id, Player.generateNewPlayer(name, socket.id));
};

/**
 * Removes the player with the given socket ID and returns the name of the
 * player removed.
 * @param {string} id The socket ID of the player to remove.
 * @return {string}
 */
Game.prototype.removePlayer = function(id) {
  if (this.clients.has(id)) {
    this.clients.remove(id);
  }
  if (this.players.has(id)) {
    player = this.players.get(id);
    this.players.remove(id);
    return player.name;
  }
  return null;
};

/**
 * Returns the name of the player with the given socket id.
 * @param {string} id The socket id to look up.
 * @return {?string}
 */
Game.prototype.getPlayerNameBySocketId = function(id) {
  var player = this.players.get(id);
  return typeof(player) === 'object' ? player.name : null;
};

Game.prototype.soundCallback = function(id, sound, volume) {
  this.clients.get(id).emit('sound', {
    sound: sound,
    volume: volume
  });
};

/**
 * Updates a player with the client's input.
 * @param {string} id The client's socket ID
 * @param {Object} keyboardState The client's keyboard state
 * @param {Array.<number>} mouse The client's mouse coordinates
 * @param {boolean} click Whether or not the client clicked
 */
Game.prototype.updatePlayerOnInput = function(id, keyboardState, mouse, click) {
  var player = this.players.get(id);
  var context = this;
  if (player) {
    var makeBombCallback = (x, y, xClick, yClick, bombFuse, id) => {
      context.bombs.push(Bomb.create(x, y, xClick, yClick, bombFuse, id));
    };
    player.updateOnInput(
        keyboardState, mouse, click, makeBombCallback,
        bind(this, this.soundCallback));
  }
};

/**
 * Returns an array of the currently active players.
 * @return {Array.<Player>}
 */
Game.prototype.getPlayers = function() {
  return this.players.values();
};

/**
 * Updates the state of all the objects in the game.
 */
Game.prototype.update = function() {
  // Update all the players.
  var players = this.getPlayers();
  for (var i = 0; i < players.length; ++i) {
    players[i].update(bind(this, this.soundCallback));
  }
  for (var i = 0; i < this.bombs.length; i++) {
    this.bombs[i].update();
    if (!this.bombs[i].shouldExist) {
      this.explosions.push(Explosion.create(
        this.bombs[i].x,
        this.bombs[i].y,
        150, 1000, 1
      ));
      var otherBombs = this.bombs.slice(0, i).concat(this.bombs.slice(i + 1));
      var context = this;
      var updatePlayerKillCallback = function(victim, killer) {
        var killerPlayer = context.players.get(killer);
        var victimPlayer = context.players.get(victim);
        killerPlayer.kills++;
        context.clients.get(killer).emit(
            'toast', `You killed ${victimPlayer.name}!`);
        context.clients.get(victim).emit(
            'toast', `You were killed by ${killerPlayer.name}!`);
      };
      this.bombs[i].explode(
          this.getPlayers(), otherBombs, updatePlayerKillCallback,
          bind(this, this.soundCallback));
      this.bombs.splice(i--, 1);
    }
  }
  for (var i = 0; i < this.explosions.length; ++i) {
    this.explosions[i].update();
    if (!this.explosions[i].shouldExist) {
      this.explosions.splice(i--, 1);
    }
  }
};

/**
 * Sends the state of the game to all the connected sockets after
 * filtering them appropriately.
 */
Game.prototype.sendState = function() {
  var leaderboard = this.getPlayers().sort((a, b) => {
    return b.kills - a.kills;
  }).slice(0, 10);
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    var currentPlayer = this.players.get(ids[i]);
    var currentClient = this.clients.get(ids[i]);
    currentClient.emit('update', {
      self: currentPlayer,
      players: this.players.values().filter(function(player) {
        /**
         * We should filter out the current player from the player
         * receiving the packet.
         */
        return player.id != currentPlayer.id;
      }),
      bombs: this.bombs,
      explosions: this.explosions,
      leaderboard: leaderboard
    });
  }
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Game;
