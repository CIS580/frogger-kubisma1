"use strict";

/**
 * @module exports the RiverManager class
 */
module.exports = exports = RiverManager;

const DOWN = 0;
const UP = 1;
const LOGS_MAX = 25;
const LOG_IMG_MIN = 0;
const LOG_IMG_MAX = 1;
const Manager = require('./manager.js');
const Log = require('./log.js');

/**
 * @constructor RiverManager
 * Creates a new RiverManager object and generates some logs
 * @param {Object} lib object representing a library
 * @param {Integer} canvasWidth width of a canvas in pixels
 * @param {Integer} canvasHeight height of a canvas in pixels
 * @param {Integer} laneWidth width of a lane in pixels
 */
function RiverManager(lib, canvasWidth, canvasHeight, laneWidth) {
  Manager.call(this, lib, canvasWidth, canvasHeight, laneWidth);

  setLanes.call(this);

  for(var i = 0; i < LOGS_MAX; i++) {
    this.entityQueue.push(new Log(i, this.lib.randomIntFromRange(LOG_IMG_MIN, LOG_IMG_MAX)));
  }
}

RiverManager.prototype = Object.create(Manager.prototype);

function setLanes(){
  var direction = this.lib.randomIntFromRange(DOWN, UP);
  this.lanes = [
    // Cell number for a lane, width of a lane, height of a lane, cars direction in lane, speed of cars in pixels, timeout of a lane, current timer
    {cell: 7, width: this.laneWidth, height: this.canvasHeight, direction: direction, speed: 0.8, timeout: {min: 3100, max: 4200, current: 0}, timer: 0},
    {cell: 8, width: this.laneWidth, height: this.canvasHeight, direction: !direction, speed: 1.3, timeout: {min: 2400, max: 4000, current: 0}, timer: 0},
    {cell: 9, width: this.laneWidth, height: this.canvasHeight, direction: direction, speed: 1.9, timeout: {min: 1800, max: 3000, current: 0}, timer: 0},
  ];
}

RiverManager.prototype.setLevel = function(level) {

  var self = this;
  var direction = this.lib.randomIntFromRange(DOWN, UP);

  this.lanes.forEach(function(lane) {
    if(!(lane.cell % 2)) lane.direction = !direction;
    else lane.direction = direction;

    lane.speed += Math.pow(level, 1/3) * 0.2;
    var decrease = self.lib.randomIntFromRange(190, 270);
    lane.timeout.min -= (lane.timeout.min > 700) ? decrease : 0;
    lane.timeout.max -= (lane.timeout.max > lane.timeout.min + decrease)? decrease : 0;
    lane.timer = 0;
  });

  this.resetLanes();

}
