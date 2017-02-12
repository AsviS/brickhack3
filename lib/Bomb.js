/**
 * @fileoverview Description
 */

const Entity = require('./Entity');
const World = require('./World');

const Constants = require('../shared/Constants');
const Util = require('../shared/Util');

function Bomb(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.timer = 5;
  this.size = Bomb.SIZE;

  this.bomb = true;
}
require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.TRAVEL_TIME = 0.25;

Bomb.SIZE = 40;

Bomb.create = function(x, y, targetX, targetY) {
  var theta = Math.atan2(targetY - y, targetX - x);
  var d = Util.getEuclideanDistance(x, y, targetX, targetY);
  var f = Constants.FRICTION;
  var t = Bomb.TRAVEL_TIME;
  var v = d / (2 * t);
  // var v = Math.sqrt(2 * f * d);
  var vx = v * Math.cos(theta);
  var vy = v * Math.sin(theta);
  return new Bomb(x, y, vx, vy);
};

Bomb.prototype.update = function() {
  this.parent.update.call(this);
  this.timer -= this.deltaTime;
  if (this.timer <= 0) {
    this.explode();
  }
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

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Bomb;
