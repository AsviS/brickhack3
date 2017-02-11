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
  this.speed = 50;

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
 * @param {number[]} mouse An array containing X,Y coordinates of mouse
 *   on click.
 * @param {boolean} click Tells whether left-click button was pressed
 */
Player.prototype.updateOnInput = function(keyboardState, mouse, click, cb) {
  if (keyboardState.up) {
    this.y -= this.speed * this.deltaTime / 1000;
  }
  if (keyboardState.down) {
    this.y += this.speed * this.deltaTime / 1000;
  }
  if (keyboardState.right) {
    this.x += this.speed * this.deltaTime / 1000;
  }
  if (keyboardState.left) {
    this.x -= this.speed * this.deltaTime / 1000;
  }
  if (click) {
    this.throwBomb(mouse[0], mouse[1], cb);
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
 * Throws a bomb to clicked position
 * @param {number} x X position of click
 * @param {number} y Y position of click
 * @param {function} cb Callback that adds a bomb
 * */
Player.prototype.throwBomb = function(x, y, cb) {
  cb(this.x, this.y, x, y);
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
