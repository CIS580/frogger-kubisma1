"use strict";

/**
 * @module exports the RacerCar class
 */
module.exports = exports = RacerCar;

const Obstacle = require('./obstacle.js');

const DOWN = 0;
const UP = 1;
const RACER_CAR_WIDTH = 64;
const RACER_CAR_HEIGHT = 81;

/**
 * @constructor RacerCar
 * Creates a new RacerCar object
 * @param {Integer} id identificator of an object
 * @param {Integer} frame which frame of an image should be displayed
 */
function RacerCar(id, frame) {
  Obstacle.call(this, id, frame, RACER_CAR_WIDTH, RACER_CAR_HEIGHT);
}

RacerCar.prototype = Object.create(Obstacle.prototype);

/**
 * @function place
 * Updates the entity to be displayed on screen
 * @param {Object} lane object which properties should be took over
 */
RacerCar.prototype.place = function(lane) {

  Obstacle.prototype.place.call(this, lane);

  if (lane.direction == DOWN) {
    this.image = new Image();
    this.image.src = 'assets/cars_racer_down.png';
  } else if (lane.direction == UP) {
    this.image = new Image();
    this.image.src = 'assets/cars_racer.png';
  }
}
