"use strict";

/**
 * @module exports the RoadManager class
 */
module.exports = exports = RoadManager;

const DOWN = 0;
const UP = 1;
const CARS_MAX = 15;
const MINI = 0;
const RACER_CAR = 1;
const MINI_FRAME_MIN = 0;
const MINI_FRAME_MAX = 4;
const RACER_CAR_FRAME_MIN = 0;
const RACER_CAR_FRAME_MAX = 3;

const Manager = require('./manager.js');
const Mini = require('./car-mini.js');
const RacerCar = require('./car-racer.js');

/**
 * @constructor RoadManager
 * Creates a new RoadManager object and generates some cars
 * @param {Object} lib object representing a library
 * @param {Integer} canvasWidth width of a canvas in pixels
 * @param {Integer} canvasHeight height of a canvas in pixels
 * @param {Integer} laneWidth width of a lane in pixels
 */
function RoadManager(lib, canvasWidth, canvasHeight, laneWidth) {
  Manager.call(this, lib, canvasWidth, canvasHeight, laneWidth);

  this.lanes = [
    // Cell number for a lane, width of a lane, height of a lane, cars direction in lane, speed of cars in pixels, timeout of a lane, current timer
    {cell: 1, width: laneWidth, height: canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 2.5, timeout: {min: 3500, max: 5000, current: 0}, timer: 0},
    {cell: 2, width: laneWidth, height: canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 3.2, timeout: {min: 2900, max: 4400, current: 0}, timer: 0},
    {cell: 3, width: laneWidth, height: canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 4.1, timeout: {min: 2400, max: 3900, current: 0}, timer: 0},
    {cell: 4, width: laneWidth, height: canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 5.5, timeout: {min: 1800, max: 2900, current: 0}, timer: 0},
  ]

  var random;
  for(var i = 0; i < CARS_MAX; i++) {
    random = this.lib.randomIntFromRange(MINI, RACER_CAR);
    if(random == MINI) {
      this.entityQueue.push(new Mini(i, this.lib.randomIntFromRange(MINI_FRAME_MIN, MINI_FRAME_MAX)));
    } else if (random == RACER_CAR){ //It's a sports car
      this.entityQueue.push(new RacerCar(i, this.lib.randomIntFromRange(RACER_CAR_FRAME_MIN, RACER_CAR_FRAME_MAX)));
    } else {
      throw "Invalid car type: " + random;
    }
  }
}

RoadManager.prototype = Object.create(Manager.prototype);
