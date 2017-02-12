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

  this.prevKBState = false;
  this.bombCooldown = Player.BOMB_COOLDOWN;
  this.deaths = 0;
  this.health = Player.MAX_HEALTH;
  this.kills = 0;
  this.lastBombTime = 0;
  this.bombFuse = 1;
  this.orientation = 0;
  this.respawning = false;
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
Player.prototype.updateOnInput = function(keyboardState, mouse, click,
                                          addBombCallback) {
  if (!this.isDead()) {
    if (keyboardState.up) {
      this.y -= this.speed * this.deltaTimeScaled;
    }
    if (keyboardState.down) {
      this.y += this.speed * this.deltaTimeScaled;
    }
    if (keyboardState.right) {
      this.x += this.speed * this.deltaTimeScaled;
    }
    if (keyboardState.left) {
      this.x -= this.speed * this.deltaTimeScaled;
    }
    if (keyboardState.longerFuse && !this.prevKBState.longerFuse) {
      this.bombFuse = Util.bound(this.bombFuse + 1, 1, 5);
    }
    if (keyboardState.shorterFuse && !this.prevKBState.shorterFuse) {
      this.bombFuse = Util.bound(this.bombFuse - 1, 1, 5);
    }
    var currentTime = (new Date()).getTime();
    if (click && currentTime > this.bombCooldown + this.lastBombTime) {
      addBombCallback(
        this.x, this.y, mouse[0], mouse[1], this.bombFuse, this.id);
        this.lastBombTime = currentTime;
      }
      this.orientation = Math.atan2(mouse[1] - this.y, mouse[0] - this.x);
  }
  this.prevKBState = keyboardState;
};

/**
 * Updates the player's position and powerup states, this runs in the 60Hz
 * server side loop so that powerups expire even when the player is not
 * moving or shooting.
 */
Player.prototype.update = function() {
  if (!this.isDead()) {
    this.parent.update.call(this);
    var boundedCoord = World.bound(this.x, this.y);
    this.x = boundedCoord[0];
    this.y = boundedCoord[1];
  } else if (!this.respawning) {
    var context = this;
    setTimeout(function() {
      context.health = Player.MAX_HEALTH;
      var point = World.getRandomPoint();
      context.x = point[0];
      context.y = point[1];
      context.respawning = false;
      console.log('called');
    }, 2500);
    context.respawning = true;
  }
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
