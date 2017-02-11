
function Bomb(x, y, vy, xy, ax, ay) {
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

Bomb.prototype.explode = function(players, bombs) {
  // l
}

module.exports = Bomb;
