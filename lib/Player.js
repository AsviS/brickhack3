/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Entity = require('./Entity');
const World = require('./World');

const Util = require('../shared/Util');

/**
 * Constructor for a Player.
 * @constructor
 */
function Player(position, name, id) {
  this.position = position;
  this.name = name;
  this.id = id;

  this.bombCooldown = Player.BOMB_COOLDOWN;
  this.deaths = 0;
  this.health = Player.MAX_HEALTH;
  this.kills = 0;
  this.lastBombTime = 0;
  this.orientation = 0;
  this.size = Player.SIZE;
  this.speed = Player.MOVEMENT_SPEED;
}
require('../shared/base');
Player.inheritsFrom(Entity);

/**
 * @const
 * @type {number}
 */
Player.BOMB_COOLDOWN = 500;

/**
 * @const
 * @type {number}
 */
Player.MAX_HEALTH = 10;

/**
 * @const
 * @type {number}
 */
Player.MOVEMENT_SPEED = 200;

/**
 * @const
 * @type {number}
 */
Player.SIZE = 50;

/**
 * Returns a new Player object given a name and id.
 * @param {string} name The display name of the player.
 * @param {string} id The socket ID of the client associated with this
 *   player.
 * @return {Player}
 */
Player.generateNewPlayer = function(name, id) {
  var point = World.getRandomPoint();
  return new Player(point, name, id);
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
Player.prototype.updateOnInput = function(keyboardState, mouse, click,
                                          addBombCallback) {
  if (keyboardState.right) {
    this.position[0] += this.speed * this.deltaTimeScaled;
  }
  if (keyboardState.left) {
    this.position[0] -= this.speed * this.deltaTimeScaled;
  }
  if (keyboardState.up) {
    this.position[1] -= this.speed * this.deltaTimeScaled;
  }
  if (keyboardState.down) {
    this.position[1] += this.speed * this.deltaTimeScaled;
  }
  var currentTime = (new Date()).getTime();
  if (click && currentTime > this.bombCooldown + this.lastBombTime) {
    addBombCallback(this.position, mouse, this.id);
    this.lastBombTime = currentTime;
  }
  this.orientation = Math.atan2(mouse[1] - this.position[1],
                                mouse[0] - this.position[0]);
};

/**
 * Updates the player's position and powerup states, this runs in the 60Hz
 * server side loop so that powerups expire even when the player is not
 * moving or shooting.
 */
Player.prototype.update = function() {
  this.parent.update.call(this);
  this.position = World.bound(this.position[0], this.position[1]);
};

Player.prototype.damage = function(damage) {
  this.health = Math.max(0, this.health - damage);
};

Player.prototype.isDead = function() {
  return this.health <= 0;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Player;
