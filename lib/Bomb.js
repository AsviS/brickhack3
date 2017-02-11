
var Entity = require('Entity');
var World = require('./World');
var Util = require('../shared/Util');

function Bomb(x, y, vx, xy, ax, ay) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
}

require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.prototype.update = function() {
  this.parent.update.call(this);
}
