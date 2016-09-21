"use strict;"

/**
 * @module exports the Lib class
 */
module.exports = exports = Lib;

/**
 * @constructor Lib
 * Creates a new Lib object (library)
 */
function Lib() {}

/**
 * @function randomIntFromRange
 * Generates a random integer from a range, min and max inclusive
 * @param {Integer} min minimum of the range
 * @param {Integer} max maximum of the range
 */
Lib.prototype.randomIntFromRange = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
