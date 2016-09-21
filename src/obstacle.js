"use strict";

/**
 * @module exports the base Obstacle class
 */
module.exports = exports = Obstacle;

const DOWN = 0;
const UP = 1;

/**
 * @constructor Obstacle
 * Creates a new Obstacle object
 * @param {Integer} frame which frame from the image has to be shown
 * @param {Integer} width image width
 * @param {Integer} height image height
 */
function Obstacle(id, frame, width, height) {
  this.id = id;
  this.image = undefined;
  this.frame = frame;
  this.direction = undefined;
  this.speed = undefined;
  this.x = undefined;
  this.y = undefined;
  this.width = width;
  this.height = height;
  //this.timer = 0;
}

/**
 * @function place
 * places the obstacle to a given lane
 * @param {Object} lane where obstacle should appear
 */
Obstacle.prototype.place = function(lane) {
  this.direction = lane.direction;
  this.x = lane.cell * lane.width;
  // Put the obstacle of the screen
  this.y = (lane.direction == DOWN) ? -this.height : lane.height;
  this.speed = lane.speed;
}

/**
 * @function reset
 * resets the obstacle
 */
Obstacle.prototype.reset = function() {
  this.image = undefined;
  this.direction = undefined;
  this.speed = undefined;
  this.x = undefined;
  this.y = undefined;
}

/**
 * @function update
 * updates the obstacle, changes it's y coordinate according
 * to it's direction and speed
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
Obstacle.prototype.update = function(elapsedTime) {

  if(this.x === undefined || this.y === undefined) return;

  if(!this.speed) throw "Invalid speed: " + this.speed;

  if(this.direction == DOWN) {
    this.y += this.speed;
  } else if (this.direction == UP) {
    this.y -= this.speed;
  } else {
    throw "Uknown direction: " + this.direction;
  }
}

/**
 * @function render
 * renders the obstacle into the provided context
 * {DOMHighResTimeStamp} elapsedTime the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Obstacle.prototype.render = function(elapsedTime, ctx) {
  ctx.drawImage(
    //Source image
    this.image,
    //Source rectangle
    this.frame * this.width, 0, this.width, this.height,
    //Destination rectangle
    this.x, this.y, this.width, this.height
  )
}
