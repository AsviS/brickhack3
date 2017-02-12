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
  this.stopTimered = false;
  this.timer = 5;
  this.size = Bomb.SIZE;
  this.shouldExist = true;
}
require('../shared/base');
Bomb.inheritsFrom(Entity);

Bomb.TRAVEL_TIME = 0.25;

Bomb.SIZE = 40;

Bomb.EXPLOSION_RADIUS = 300;

Bomb.EXPLOSIVE_FORCE = 80;

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
    this.shouldExist = false;
  }
  this.stopTimer -= this.deltaTimeScaled;
  if (this.stopTimer <= 0 && !this.stopTimered) {
    this.vx = 0;
    this.vy = 0;
    this.stopTimered = true;
  }
};

Bomb.prototype.explode = function(players, bombs) {
  for (var bomb of bombs) {
    var distance = Util.getEuclideanDistance(this.x, this.y, bomb.x, bomb.y);
    if (distance < Bomb.EXPLOSION_RADIUS) {
      var inverse = Bomb.EXPLOSION_RADIUS - distance;
      var v = Util.linearScale(inverse, 0, distance, 0, Bomb.EXPLOSIVE_FORCE);
      var angle = Math.atan2(bomb.y - this.y, bomb.x - this.x);
      var vx = v * Math.cos(angle);
      var vy = v * Math.sin(angle);
      bomb.applyForce(vx, vy);
    }
  };
  for (var player of players) {
    var distance = Util.getEuclideanDistance(
        this.x, this.y, player.x, player.y);
    if (distance < Bomb.EXPLOSION_RADIUS) {
      var inverse = Bomb.EXPLOSION_RADIUS - distance;
      var v = Util.linearScale(inverse, 0, distance, 0, Bomb.EXPLOSIVE_FORCE);
      var angle = Math.atan2(player.y - this.y, player.x - this.x);
      var vx = v * Math.cos(angle);
      var vy = v * Math.sin(angle);
      player.applyForce(vx, vy);
      player.damage(v / 10);
    }
  }
}

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = Bomb;
