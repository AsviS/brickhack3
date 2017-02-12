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
  
  this.stopTimer = Bomb.TRAVEL_TIME;
  this.timer = 2;
  this.size = Bomb.SIZE;
  this.shouldExist = true;
}
require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.TRAVEL_TIME = 0.25;

Bomb.SIZE = 40;

Bomb.create = function(x, y, targetX, targetY) {
  var dx = targetX - x;
  var dy = targetY - y;
  var vx = dx / Bomb.TRAVEL_TIME;
  var vy = dy / Bomb.TRAVEL_TIME;
  return new Bomb(x, y, vx, vy);
};

Bomb.prototype.update = function() {
  this.parent.update.call(this);
  this.timer = Math.max(0, this.timer - this.deltaTimeScaled);
  if (this.timer <= 0 && this.shouldExist) {
    this.explode();
    this.shouldExist = false;
  }
  if (this.stopTimer >= 0) {
    this.stopTimer -= this.deltaTimeScaled;
  } else {
    this.vx = 0;
    this.vy = 0;
  }
};

Bomb.prototype.explode = function(players, bombs) {
  console.log(bombs);
  for (var bomb in bombs) {
    if (Util.getEuclideanDistance(bomb.x, bomb.y, this.x, this.y) < 300) {
      bomb.applyForce((bomb.x - this.x) * (bomb.x - this.x),
                      (bomb.y - this.y) * (bomb.y - this.y));
    }
  };
  for (var player in players) {
    if (Util.getEuclideanDistance(player.x, player.y, this.x, this.y) < 2500) {
      bomb.applyForce((player.x - this.x) * (player.x - this.x),
                      (player.y - this.y) * (player.y - this.y));
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
