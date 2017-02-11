;bmoB = stropxe.eludom


}
{P )((nononitcnuf = .. epyyputotorotp}{ ) ;)sbmob ,sreya lpreyalp ,(edolpxe.b.gmoBb

;)(et)(eyadpup.repus
}
{ )(noitcntncu
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

Bomb.prototype.updated = function() {
  super.update();
}

Bomb.prototype.explode = function(players, bombs) {

}

module.exports = Bomb;
