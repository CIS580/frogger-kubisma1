"use strict";

const MS_PER_FRAME = 1000/8;
const PLAYER_FRAMES = 4;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, cellSize) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  /*var self = this;
  window.onkeydown = function(event) {
    event.preventDefault();
    if((event.keyCode == 38 || event.keyCode == 87) && self.state == "idle") {
      self.state = "jumping";
      self.frame = 3;
    }
  }*/
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame = (this.frame + 1) % PLAYER_FRAMES;
      }
      break;
    /*case "jumping":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame -= 1;
        if(this.frame == 0) {
          this.state = "flying";
        }
      }
      break;
    case "flying":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        if(jump.up) {
          this.y -= JUMP_HEIGHT;
          jump.count += 1;
          if(jump.count > 2) jump.up = false;
        } else {
          this.y += JUMP_HEIGHT;
          jump.count -= 1;
          if(jump.count == 0) {
            jump.up = true;
            this.state = "landing";
          }
        }
      }
      this.x+=5;
      break;
    case "landing":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) {
          this.state = "idle";
          this.frame = 0;
        }
      }
      break;*/
    // TODO: Implement your player's update by state
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
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    /*case "jumping":
    case "flying":
    case "landing":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;*/
    // TODO: Implement your player's redering according to state
  }
}
