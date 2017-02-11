var Entity = require('./Entity');
var World = require('./World');
var Util = require('../shared/Util');

function Explosion(x, y, frame, startTime, endTime) {
  this.x = x;
  this.y = u;
  this.frame = frame;
  this.startTime = startTime;
  this.endTime = endTime;
}

require('../shared/base');
Explosion.inheritsFrom(Entity);
