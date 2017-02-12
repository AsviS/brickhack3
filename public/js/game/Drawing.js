/**
 * @fileoverview Handles the drawing of game sprites onto the canvas.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

/**
 * Creates a Drawing object.
 * @constructor
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @param {Object<string, Image>} images The image objects used to draw
 *   each entity.
 */
function Drawing(context, images) {
  this.context = context;
  /**
   * @type {Object<string, Image|Array.<Image>>}
   */
  this.images = images;
}

/**
 * @const
 * @type {string}
 */
Drawing.BASE_IMG_URL = '/public/img/';

/**
 * @const
 * @type {Object}
 */
Drawing.IMG_SRCS = {
  tile: 'tile.png',
  player: 'terrorist.png',
  bomb: 'bomb.png',
  explosion: [
    '/explosion/00.png', '/explosion/01.png', '/explosion/02.png',
    '/explosion/03.png', '/explosion/04.png', '/explosion/05.png',
    '/explosion/06.png', '/explosion/07.png', '/explosion/08.png',
    '/explosion/09.png', '/explosion/10.png', '/explosion/11.png',
    '/explosion/12.png', '/explosion/13.png', '/explosion/14.png',
    '/explosion/15.png'
  ]
};

/**
 * @const
 * @type {number}
 */
Drawing.TILE_SIZE = 100;

/**
 * @const
 * @type {string}
 */
Drawing.NAME_FONT = '25px Ubuntu';

/**
 * @const
 * @type {string}
 */
Drawing.NAME_COLOR = 'black';

/**
 * @const
 * @type {string}
 */
Drawing.BOMB_FONT = '20px Ubuntu';

/**
 * @const
 * @type {string}
 */
Drawing.BOMB_COLOR = '#c62828';

/**
 * Factory method for creating a Drawing object. It initializes all the
 * necessary Image objects.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @return {Drawing}
 */
Drawing.create = function(context) {
  var images = {};
  for (var key in Drawing.IMG_SRCS) {
    if (typeof(Drawing.IMG_SRCS[key]) === 'string') {
      images[key] = new Image();
      images[key].src = Drawing.BASE_IMG_URL + Drawing.IMG_SRCS[key];
    } else {
      images[key] = Drawing.IMG_SRCS[key].map((src) => {
        var image = new Image();
        image.src = Drawing.BASE_IMG_URL + src;
        return image;
      });
    }
  }
  return new Drawing(context, images);
};

/**
 * Clears the canvas.
 */
Drawing.prototype.clear = function() {
  this.context.clearRect(0, 0, Constants.CANVAS_WIDTH,
                         Constants.CANVAS_HEIGHT);
};

/**
 * Draws a player onto the canvas.
 * @param {boolean} isSelf Whether or not this player is the self player
 * @param {string} name The name of the player
 * @param {number} x The canvas x coordinate of the player
 * @param {number} y The canvas y coordinate of the player
 * @param {number} size The size of the player, corresponds to their radial
 *   hitbox
 */
Drawing.prototype.drawPlayer = function(isSelf, name, x, y, size, orientation) {
  this.context.save();
  this.context.translate(x, y);
  this.context.rotate(orientation + Math.PI / 2);
  this.context.textAlign = 'center';
  this.context.font = Drawing.NAME_FONT;
  this.context.fillStyle = Drawing.NAME_COLOR;
  this.context.fillText(name, 0, -50);
  var image = this.images['player'];
  this.context.drawImage(image, -size, -size, size * 2, size * 2);
  this.context.restore();
};

Drawing.prototype.drawBomb = function(x, y, size, timer) {
  this.context.save();
  this.context.translate(x, y);
  var image = this.images['bomb'];
  this.context.drawImage(image, -size, -size, size * 2, size * 2);
  this.context.textAlign = 'center';
  this.context.font = Drawing.BOMB_FONT;
  this.context.fillStyle = Drawing.BOMB_COLOR;
  this.context.fillText(Math.ceil(timer), 0, 0);
  this.context.restore();
};

Drawing.prototype.drawExplosion = function(x, y, size, frame) {
  this.context.save();
  this.context.translate(x, y);
  var image = this.images['explosion'][frame];
  this.context.drawImage(image, -size, -size, size * 2, size * 2);
  this.context.restore();
};

/**
 * This function draws the background tiles on the canvas.
 * @param {number} minX The minimum canvas x coordinate to start drawing from.
 * @param {number} minY The minimum canvas y coordinate to start drawing from.
 * @param {number} maxX The maximum canvas x coordinate to draw to.
 * @param {number} maxY The maximum canvas y coordinate to draw to.
 */
Drawing.prototype.drawTiles = function(minX, minY, maxX, maxY) {
  this.context.save();
  var tile = this.images['tile'];
  for (var x = minX; x < maxX; x += Drawing.TILE_SIZE) {
    for (var y = minY; y < maxY; y += Drawing.TILE_SIZE) {
      this.context.drawImage(tile, x, y);
    }
  }
  this.context.restore();
};
