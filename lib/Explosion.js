/**
 * @fileoverview Explosion class
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Entity = require('./Entity');
const World = require('./World');

const Util = require('../shared/Util');

function Explosion(x, y, size, start, duration, totalFrames) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.start = start;
  this.duration = duration;
  this.totalFrames = totalFrames;

  this.shouldExist = true;
  this.frame = 0;
}
require('../shared/base');
Explosion.inheritsFrom(Entity);

/**
* @const
* @type {number}
*/
Explosion.FRAME_COUNT = 16;

Explosion.create = function(x, y, size, duration, iterations) {
  var start = (new Date()).getTime();
  var totalFrames = Explosion.FRAME_COUNT * iterations;
  return new Explosion(x, y, size, start, duration, totalFrames);
};

Explosion.prototype.update = function() {
  var now = (new Date()).getTime();
  var deltaTime = now - this.start;
  if (deltaTime >= this.duration) {
    this.shouldExist = false;
    this.frame = this.totalFrames - 1;
  } else {
    this.frame = Math.floor((deltaTime / this.duration) * this.totalFrames);
    this.frame %= Explosion.FRAME_COUNT;
  }
};
