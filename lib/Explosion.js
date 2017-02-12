/**
 * @fileoverview Explosion class
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

var Entity = require('./Entity');
var World = require('./World');

var Util = require('../shared/Util');

function Explosion(x, y, start, end, frames) {
  this.x = x;
  this.y = y;
  this.start = start;
  this.end = end;
  this.frames = frames;

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

Explosion.create = function(x, y, duration, iterations) {
  var start = (new Date()).getTime();
  var end = start + duration;
  var frames = (duration * iterations) / Explosion.FRAME_COUNT;
  return new Explosion(x, y, start, end, frames);
};

Explosion.prototype.update = function() {
  var now = (new Date()).getTime();
  if (now >= this.end) {
    this.shouldExist = false;
    this.frame = this.frames - 1;
  } else {
    this.frame = Math.floor((now - this.start) / this.frames);
  }
};
