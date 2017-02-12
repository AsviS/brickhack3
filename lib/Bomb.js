/**
 * @fileoverview Description
 */

const Entity = require('./Entity');
const World = require('./World');

const Constants = require('../shared/Constants');
const Util = require('../shared/Util');

const dist = require('vectors/dist')(2);

function Bomb(position, velocity, acceleration) {
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;

  this.size = Bomb.SIZE;
}
require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.TRAVEL_TIME = 0.25;

Bomb.SIZE = 40;

Bomb.create = function(position, target) {
  var theta = Math.atan2(target[1] - position[1], target[0] - position[0]);
  var d = dist(position, target);
  var f = Constants.FRICTION;
  var t = Bomb.TRAVEL_TIME;
  var v = (d - (0.5 * f * t * t)) / t;
  var vx = v * Math.cos(theta);
  var vy = v * Math.sin(theta);
  return new Bomb(position, [vx, vy], [0, 0]);
};

Bomb.prototype.update = function() {
  this.parent.update.call(this);
};

Bomb.prototype.explode = function(players, bombs) {
  // for (bomb in bombs) {
  //   if (Util.getEuclideanDistance2(bomb.X, bomb.Y, this.X, this.Y) < 10) {
  //     bomb.applyForce((bomb.X - this.X) * (bomb.X - this.X),
  //                     (bomb.Y - this.Y) * (bomb.Y - this.Y));
  //   }
  // };
  // for (player in players) {
  //   if (Util.getEuclideanDistance2(player.X, player.Y, this.X, this.Y) < 10) {
  //     bomb.applyForce((player.X - this.X) * (player.X - this.X),
  //                     (player.Y - this.Y) * (player.Y - this.Y));
  //   }
    // Calculate the distance between the player and the bomb,
    // Use Util.linearScale to scale the distance to a damage, the closer
    // they are the more damage they take.
    // player.damage()
  // }
}

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Bomb;
