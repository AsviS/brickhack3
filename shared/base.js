/**
 * @fileoverview This file contains some base functions useful to both the
 *  server and the client.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * This extension of the Function class allows for class inheritance.
 * Example usage:
 * require('./path/to/base');
 * Player.inheritsFrom(Entity);
 * @param {Function} parent The child object which should inherit from this
 *   object.
 * @return {Function}
 */
Function.prototype.inheritsFrom = function(parent) {
  this.prototype = new parent();
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
  return this;
};
