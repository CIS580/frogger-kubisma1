"use strict";

/**
 * @module exports the Mini class
 */
module.exports = exports = Mini;

const DOWN = 0;
const UP = 1;
const MINI_WIDTH = 64;
const MINI_HEIGHT = 92;

const Obstacle = require('./obstacle.js');

/**
 * @constructor Mini
 * Creates a new Mini car object
 * @param {Integer} id identificator of an object
 * @param {Integer} frame which frame of an image should be displayed
 */
function Mini(id, frame) {
  Obstacle.call(this, id, frame, MINI_WIDTH, MINI_HEIGHT);
}

Mini.prototype = Object.create(Obstacle.prototype);

/**
 * @function place
 * Updates the entity to be displayed on screen
 * @param {Object} lane object which properties should be took over
 */
Mini.prototype.place = function(lane) {

  Obstacle.prototype.place.call(this, lane);

  if (lane.direction == DOWN) {
    this.image = new Image();
    this.image.src = 'assets/cars_mini_down.png';
  } else if (lane.direction == UP) {
    this.image = new Image();
    this.image.src = 'assets/cars_mini.png';
  }
}
