"use strict";

/**
 * @module exports the Car class
 */
module.exports = exports = Mini;

const Car = require('./car.js');

const DOWN = 1;
const UP = 0;
const MINI_WIDTH = 64;
const MINI_HEIGHT = 92;

function Mini(state, position) {
  var img = new Image();
  if(state == DOWN) {
    img.src = 'assets/cars_mini_down.png';
  } else {
    img.src = 'assets/cars_mini.png';
  }
  Car.call(this, img, 0, position, MINI_WIDTH, MINI_HEIGHT);
}

Mini.prototype = Object.create(Car.prototype);
