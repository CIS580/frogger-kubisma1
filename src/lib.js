"use strict;"

/**
 * @module exports the Lib class
 */
module.exports = exports = Lib;

function Lib() {}

Lib.prototype.randomFromRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
