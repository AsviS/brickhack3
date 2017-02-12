
var Entity = require('./Entity');
var World = require('./World');
var Util = require('../shared/Util');

function Bomb(x, y, vx, vy, ax, ay) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
  console.log("\n\n\n\n\n\n\n\n BOMB MADE WITH VX:"+vx);
}

require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.prototype.update = function() {
  this.parent.update.call(this);
}

Bomb.prototype.explode = function(players, bombs) {
  for(bomb in bombs) {
    if(getEuclideanDistance2(bomb.X, bomb.Y, this.X, this.Y) < 10)
        bomb.applyForce((bomb.X - this.X)*(bomb.X - this.X), (bomb.Y-this.Y)*(bomb.Y-this.Y));
  };
  for(player in players){
    if (getEuclideanDistance2(player.X, player.Y, this.X, this.Y) < 10)
        bomb.applyForce((player.X - this.X)*(player.X - this.X), (player.Y-this.Y)*(player.Y-this.Y));
  }
}

module.exports = Bomb;
