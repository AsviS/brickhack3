/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {number} x The x coordinate of the entity
 * @param {number} y The y coordinate of the entity
 * @param {number} vx The velocity in the x direction of the entit
 * @param {number} vy The velocity in the y direction of the entity
 * @param {number} ax The acceleration in the x direction of the entity
 * @param {number} size The radial hitbox size of the entity.
 */
function Entity(x, y, vx, vy, ax, ay, size) {
  this.x = x || 0;
  this.y = y || 0;
  this.vx = vx || 0;
  this.vy = vy || 0;
  this.ax = ax || 0;
  this.ay = ay || 0;
  this.size = size || 0;

  this.lastUpdateTime = 0;
  this.deltaTime = 0;
}

/**
 * Updates the entity's position based on its velocity according to
 * the amount of time the passed between this update and the last
 * update.
 */
Entity.prototype.update = function() {
  var currentTime = (new Date()).getTime();
  if (this.lastUpdateTime == 0) {
    this.deltaTime = 0;
  } else {
    this.deltaTime = currentTime - this.lastUpdateTime;
  }
  if (!Util.inBound(this.vx, -.25, .25) || !Util.inBound(this.vy, -.25, .25)) {
    this.vx += Util.getSign(this.vx) * Constants.FRICTION *
        this.deltaTime / 1000;
    this.vy += Util.getSign(this.vy) * Constants.FRICTION *
        this.deltaTime / 1000;
        console.log("Within bounds");
  } else {
    this.vx = this.vy = 0;
  }
  this.x += this.vx * this.deltaTime / 1000;
  this.y += this.vy * this.deltaTime / 1000;
  this.lastUpdateTime = currentTime;
  console.log('Position: ' + this.x + ',' + this.y + ' Velocity: ' + this.vx + ', ' + this.vy);
};

/**
 * Applys a force to the given Entity
 */
Entity.prototype.applyForce = function(vx, vy) {
  this.vx += vx;
  this.vy += vy;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Entity;
