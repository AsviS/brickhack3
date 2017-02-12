/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Constants = require('../shared/Constants');
const Util = require('../shared/Util');

const add = require('vectors/add')(2);
const copy = require('vectors/copy')(2);
const div = require('vectors/div')(2);
const mult = require('vectors/mult')(2);
const norm = require('vectors/normalize')(2);

/**
 * All entities will inherit from this class.
 * @constructor
 */
function Entity(position, velocity, acceleration, size) {
  this.position = position || [0, 0];
  this.velocity = velocity || [0, 0];
  this.acceleration = acceleration || [0, 0];
  this.size = size || 0;

  this.lastUpdateTime = 0;
  this.deltaTime = 0;
  this.deltaTimeScaled = 0;
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
  this.deltaTimeScaled = this.deltaTime / 1000;
  var friction = mult(norm(copy(this.velocity)), -Constants.FRICTION);
  this.applyForce(friction);
  add(this.position, mult(copy(this.velocity), this.deltaTimeScaled));
  add(this.velocity, mult(copy(this.acceleration), this.deltaTimeScaled));
  this.acceleration = [0, 0];
  this.lastUpdateTime = currentTime;
};

/**
 * Applys a force to the given Entity
 */
Entity.prototype.applyForce = function(force) {
  var f = copy(force);
  add(this.acceleration, f);
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Entity;
