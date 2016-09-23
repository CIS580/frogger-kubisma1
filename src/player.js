"use strict";

const MS_PER_FRAME = 1000/22;
const PLAYER_FRAMES = 4;
const DOWN = 0;
const UP = 1;
const RIGHT = 2;
const INTER_LEVEL_PAUSE = 1000;
const RIVER_X_BEGIN_CELL = 7;
const RIVER_X_END_CELL = 9;


/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvasWidth, canvasHeight, cellSize) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.startingPosition = position;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.cellSize = cellSize;
  this.jumpLength = cellSize / PLAYER_FRAMES;
  this.idle = 0;
  this.lives = 3;

  var self = this;
  window.onkeydown = function(event) {
    event.preventDefault();

    if(self.state != "idle") return;

    switch(event.keyCode) {
      case 38:
      case 87:
        if(canJump.call(self, UP)) self.state = "jumpUp";
        break;
      case 39:
      case 68:
        if(canJump.call(self, RIGHT)) self.state = "jumpRight";
        break;
      case 40:
      case 83:
        if(canJump.call(self, DOWN)) self.state = "jumpDown";
        break;
    }
    this.frame = -1;
  }
}

function canJump(direction) {
  //console.log("x: " + this.x + " y: " + this.y + " j: " + this.jumpLength);
  switch(direction) {
    case UP:
      if(this.y - this.jumpLength >= 0) return true;
      break;
    case RIGHT:
      if(this.x + this.jumpLength <= this.canvasWidth - this.width) return true;
      break;
    case DOWN:
      if(this.y + this.jumpLength <= this.canvasHeight - this.height) return true;
      break;
    default:
      throw "Invalid direction " + direction;
  }
  return false;
}

Player.prototype.isAlive = function() {
  return this.lives > 0;
}

Player.prototype.hasWon = function(){
  return this.x >= this.canvasWidth - (1.5 * this.cellSize);
}

Player.prototype.reset = function() {
  this.state = "reset";
  this.x = this.startingPosition.x;
  this.y = this.startingPosition.y;
  this.frame = 0;
  this.timer = 0;
  this.idle = INTER_LEVEL_PAUSE;
}

function testForRectCollision(entity) {
  return (this.x + this.width < entity.x ||
          this.x > entity.x + entity.width ||
          this.y + this.height < entity.y ||
          this.y > entity.y + entity.height);
}

function isCollidingWithCar(cars) {
  var self = this;
  try {
    cars.forEach(function(car) {
      if(!testForRectCollision.call(self, car)) {
        throw "Hit";
      }
    });
  } catch(e) {
    if(e == "Hit") return true;
    throw e;
  }
  return false;
}

function isOnLog(logs){
  if(this.x + this.width < RIVER_X_BEGIN_CELL * this.cellSize ||
    this.x + this.width >= (RIVER_X_END_CELL + 1) * this.cellSize) return null;

  logs.sort(function(l1, l2) { return l1.x - l2.x });

  var l = undefined;
  var self = this;
  try {
    logs.forEach(function(log){
      if(!testForRectCollision.call(self, log)) {
        throw "On a log";
      }
    });
  } catch(e) {
    if(e == "On a log") return true;
    throw e;
  }

  return false;
}

Player.prototype.checkCollisions = function(cars, logs) {
  if(!this.x) return false;
  if(isCollidingWithCar.call(this, cars)) return true;

  var res = isOnLog.call(this, logs)
  if(res == null) {
    return false;
  } else if(res){
    return false;
  }

  return true;
}

function newLevelPause(time){
  if(this.idle > 0) {
    if(this.idle - time < 0) this.state = "idle";
    this.idle -= time;
    return true;
  }
  return false;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  if(newLevelPause.call(this, time)) return;
  switch(this.state) {
    case "idle":
    case "reset":
      this.timer += time;
      if(this.timer > 3 * MS_PER_FRAME) {
        this.timer = 0;
        this.frame = (this.frame + 1) % PLAYER_FRAMES;
      }
      break;
    case "jumpUp":
    case "jumpRight":
    case "jumpDown":
      this.timer += time;
      if(this.timer >= MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;

        switch(this.state){
          case "jumpUp":
            this.y -= this.jumpLength;
            break;
          case "jumpRight":
            this.x += this.jumpLength;
            break;
          case "jumpDown":
            this.y += this.jumpLength;
            break;
        }

        if(this.frame == PLAYER_FRAMES) {
          this.state = "idle";
          this.frame = 0;
        }

      }
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
    case "reset":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "jumpUp":
    case "jumpRight":
    case "jumpDown":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
  }

  ctx.fillStyle = "#fff";
  ctx.font = "bold 1em Georgia";
  ctx.fillText("Lives: " + this.lives, 680, 20);

  if(!this.isAlive()) {
    ctx.font = "bold 4em Georgia";
    ctx.fillText("GAME OVER!", 130, 240);
    throw "Game Over";
  }
}
