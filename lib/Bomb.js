/**
 * @fileoverview Description
 */

const Entity = require('./Entity');
const World = require('./World');

const Constants = require('../shared/Constants');
const Util = require('../shared/Util');

function Bomb(x, y, vx, vy, ax, ay) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
}
require('../shared/base');
Bomb.inheritsFrom(Entity);
Bomb.TRAVEL_TIME = 0.5;

Bomb.create = function(x, y, targetX, targetY) {
  var vx = ( (targetX - x) - 0.5 * Constants.FRICTION * 
    Bomb.TRAVEL_TIME * Bomb.TRAVEL_TIME) / Bomb.TRAVEL_TIME;
  var vy = ( (targetX - x) - 0.5 * Constants.FRICTION *
    Bomb.TRAVEL_TIME * Bomb.TRAVEL_TIME) / Bomb.TRAVEL_TIME;
  return new Bomb(x, y, vx, vy, 0, 0);
};

Bomb.prototype.update = function() {
  this.parent.update.call(this);
};

Bomb.prototype.explode = function(players, bombs) {
  for (bomb in bombs) {
    if (Util.getEuclideanDistance2(bomb.X, bomb.Y, this.X, this.Y) < 10) {
      bomb.applyForce((bomb.X - this.X) * (bomb.X - this.X),
                      (bomb.Y - this.Y) * (bomb.Y - this.Y));
    }
  };
  for (player in players) {
    if (Util.getEuclideanDistance2(player.X, player.Y, this.X, this.Y) < 10) {
      bomb.applyForce((player.X - this.X) * (player.X - this.X),
                      (player.Y - this.Y) * (player.Y - this.Y));
    }
    // Calculate the distance between the player and the bomb,
    // Use Util.linearScale to scale the distance to a damage, the closer
    // they are the more damage they take.
    // player.damage()
  }
}

module.exports = Bomb;
