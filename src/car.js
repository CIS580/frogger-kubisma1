"use strict";

/**
 * @module exports the base Car class
 */
module.exports = exports = Car;

const CAR_SPEED = 1000/8;

function Car(image, frame, position, width, height) {
  this.image = image;
  this.frame = frame;
  this.x = position.x;
  this.y = position.y;
  this.width = width;
  this.height = height;
  this.timer = 0;
}

Car.prototype.update = function(elapsedTime) {
  this.y += 1;
}

Car.prototype.render = function(elapsedTime, ctx) {
  ctx.drawImage(
    //Source image
    this.image,
    //Source rectangle
    this.frame * this.width, 0, this.width, this.height,
    //Destination rectangle
    this.x, this.y, this.width, this.height
  )
}
