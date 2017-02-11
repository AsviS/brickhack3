/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * All entities will inherit from this class.
 * @constructor
 * @param {number} x The x coordinate of the entity.
 * @param {number} y The y coordinate of the entity.
 * @param {number} vx The velocity in the x direction of the entity.
 * @param {number} vy The velocity in the y direction of the entity.
 */
function Entity(x, y, vx, vy, ax, ay) {
  this.x = x || 0;
  this.y = y || 0;
  this.vx = vx || 0;
  this.vy = vy || 0;
  this.ax = ax || 0;
  this.ay = ay || 0;

  this.lastUpdateTime = 0;
  this.deltaTime = 0;
  this.lastX = this.x;
  this.lastY = this.y;
}

/**
 * Returns true if this entity is visible to the given player.
 * @param {Player} player The player to check visibility to.
 * @return {boolean}
 */
Entity.prototype.isVisibleTo = function(player) {
  return Util.inBound(
      this.x,
      player.x - Constants.VISIBILITY_THRESHOLD_X,
      player.x + Constants.VISIBILITY_THRESHOLD_X) && Util.inBound(
      this.y,
      player.y - Constants.VISIBILITY_THRESHOLD_Y,
      player.y + Constants.VISIBILITY_THRESHOLD_Y);
};

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
  this.deltaPos = Util.getEuclideanDistance(
    this.lastX, this.lastY, this.x, this.y);
  this.x += this.vx * this.deltaTime / 1000;
  this.y += this.vy * this.deltaTime / 1000;
  this.ax -= Constants.FRICTION * this.deltaPos;
  this.ay -= Constants.FRICTION * this.deltaPos;
  this.vx += ax * this.deltaTime / 1000;
  this.vy += ay * this.deltaTime / 1000;
  this.lastUpdateTime = currentTime;
  this.lastX = this.x;
  this.lastY = this.y;
};

/**
 * Applys a force to the given Entity 
 */
Entity.prototype.applyForce = function(distVector) {
    this.ax += distVector.x;
    this.ay += distVector.y;
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Entity;
