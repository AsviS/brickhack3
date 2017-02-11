/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Entity = require('./Entity');
var World = require('./World');

var Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
 * @param {number} x X-coordinate to generate the player at.
 * @param {number} y Y-coordinate to generate the player at.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 */
function Player(x, y, name, id) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.id = id;

  this.health = Player.MAX_HEALTH;
  this.kills = 0;
  this.deaths = 0;
}
require('../shared/base');
Player.inheritsFrom(Entity);

/**
 * MAX_HEALTH is in health units.
 * @const
 * @type {number}
 */
Player.MAX_HEALTH = 10;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  var point = World.getRandomPoint();
  return new Player(point[0], point[1], name, id);
};

/**
 * Updates this player given the the client's keyboard state and mouse angle
 * for setting the tank turret.
 * @param {Object} keyboardState A JSON Object storing the state of the
 *   client keyboard.
 * @param {number} turretAngle The angle of the client's mouse with respect
 *   to the tank.
 */
Player.prototype.updateOnInput = function(keyboardState) {
  if (keyboardState.up) {
    this.y += this.vy * this.deltaTime / 1000;
  }
  if (keyboardState.down) {
    this.y -= this.vy * this.deltaTIme / 1000;
  }
  if (keyboardState.right) {
    this.x += this.vx * this.deltaTIme / 1000;
  }
  if (keyboardState.left) {
    this.x -= this.vx * this.deltaTime / 1000;
  }
};

/**
 * Updates the player's position and powerup states, this runs in the 60Hz
 * server side loop so that powerups expire even when the player is not
 * moving or shooting.
 */
Player.prototype.update = function() {
  this.parent.update.call(this);
  var boundedCoord = World.bound(this.x, this.y);
  this.x = boundedCoord[0];
  this.y = boundedCoord[1];
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
