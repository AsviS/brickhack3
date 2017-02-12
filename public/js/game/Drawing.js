/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 * TODO: Add explosion drawing.
 */

/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @param {Object<string, Image>} images The image objects used to draw
 *   each entity.
 * @constructor
 */
function Drawing(context, images) {
  this.context = context;
  /**
   * @type {Object<string, Image>}
   */
  this.images = images;
}

/**
 * @const
 * @type {string}
 */
Drawing.BASE_IMG_URL = '/public/img/';

Drawing.IMG_SRCS = {
  tile: 'tile.png',
  player: 'terrorist.png',
  bomb: 'bomb.png'
};

/**
 * @const
 * @type {number}
 */
Drawing.TILE_SIZE = 100;

Drawing.NAME_FONT = '25px Ubuntu';

Drawing.NAME_COLOR = 'black';

Drawing.BOMB_FONT = '20px Ubuntu';

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
    images[key] = new Image();
    images[key].src = Drawing.BASE_IMG_URL + Drawing.IMG_SRCS[key];
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

Drawing.prototype.drawPlayer = function(isSelf, name, x, y, size) {
  this.context.save();
  this.context.translate(x, y);

  this.context.textAlign = 'center';
  this.context.font = Drawing.NAME_FONT;
  this.context.fillStyle = Drawing.NAME_COLOR;
  this.context.fillText(name, 0, -50);

  var image = this.images['player'];
  this.context.drawImage(image, -size / 2, -size / 2, size, size);
  this.context.restore();
};

Drawing.prototype.drawBomb = function(x, y, size, timer) {
  this.context.save();
  this.context.translate(x, y);

  this.context.textAlign = 'center';
  this.context.font = Drawing.BOMB_FONT;
  this.context.fillStyle = Drawing.BOMB_COLOR;
  this.context.fillText(timer, 0, 0);

  var image = this.images['bomb'];
  this.context.drawImage(image, -size / 2, -size / 2, size, size);
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
