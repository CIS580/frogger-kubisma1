"use strict";

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

const DOWN = 0;
const UP = 1;
const LOG_WIDTH = 64;
const LOG_HEIGHT = 100;

const Obstacle = require('./obstacle.js');

/**
 * @constructor Log
 * Creates a new Log object
 * @param {Integer} id identificator of an object
 * @param {Integer} frame which frame of an image should be displayed
 */
function Log(id, frame) {
  Obstacle.call(this, id, frame, LOG_WIDTH, LOG_HEIGHT);
}

Log.prototype = Object.create(Obstacle.prototype);

/**
 * @function place
 * Updates the entity to be displayed on screen
 * @param {Object} lane object which properties should be took over 
 */
Log.prototype.place = function(lane) {

  Obstacle.prototype.place.call(this, lane);

  this.image = new Image();
  this.image.src = 'assets/logs.png';
}
