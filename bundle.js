(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Useful constants */
const CELL_SIZE = 64;

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Lib = require('./lib.js');
const RoadManager = require('./road-manager.js');
const RiverManager = require('./river-manager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 192}, canvas.width, canvas.height, CELL_SIZE);
var lib = new Lib();
var roadManager = new RoadManager(lib, canvas.width, canvas.height, CELL_SIZE);
roadManager.init();
var riverManager = new RiverManager(lib, canvas.width, canvas.height, CELL_SIZE);
riverManager.init();
var background = new Image();
background.src = 'assets/background.png';

var level = 1;
var score = 0;

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  if(player.hasWon()) {
    level++;
    score += Math.floor(300 * Math.sqrt(level));
    player.reset();
    roadManager.setLevel(level);
    riverManager.setLevel(level);
    return;
  }

  riverManager.update(elapsedTime);
  player.update(elapsedTime);
  roadManager.update(elapsedTime);

  if(player.checkCollisions(roadManager.entitiesActive, riverManager.entitiesActive)) {
    player.lives--;
    player.reset();
  }

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(background, 0, 0);
  riverManager.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);
  roadManager.render(elapsedTime, ctx);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 1em Georgia";
  ctx.fillText("Level: " + level, 10, 20);
  ctx.fillText("Score: " + score, 10, 40);
}

},{"./game.js":4,"./lib.js":5,"./player.js":9,"./river-manager.js":10,"./road-manager.js":11}],2:[function(require,module,exports){
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

},{"./obstacle.js":8}],3:[function(require,module,exports){
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

},{"./obstacle.js":8}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
"use strict;"

/**
 * @module exports the Lib class
 */
module.exports = exports = Lib;

/**
 * @constructor Lib
 * Creates a new Lib object (library)
 */
function Lib() {}

/**
 * @function randomIntFromRange
 * Generates a random integer from a range, min and max inclusive
 * @param {Integer} min minimum of the range
 * @param {Integer} max maximum of the range
 */
Lib.prototype.randomIntFromRange = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

},{}],6:[function(require,module,exports){
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

},{"./obstacle.js":8}],7:[function(require,module,exports){
"use strict";

/**
 * @module exports the Manager base class
 */
module.exports = exports = Manager;

/**
 * @constructor Manager
 * Creates a new Manager object (base class)
 * @param {Object} lib object representing a library
 * @param {Integer} canvasWidth width of a canvas in pixels
 * @param {Integer} canvasHeight height of a canvas in pixels
 * @param {Integer} laneWidth width of a lane in pixels
 */
function Manager(lib, canvasWidth, canvasHeight, laneWidth) {
  this.lib = lib;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.lanes = undefined;
  this.laneWidth = laneWidth;
  this.entityQueue = []; // Cars waiting to be placed
  this.entitiesActive = []; // Active cars
}

/**
 * @function init
 * Initializes a manager, places an obstacle to each line
 */
Manager.prototype.init = function() {
  var self = this;
  this.lanes.forEach(function(lane){
    lane.timeout.current = self.lib.randomIntFromRange(lane.timeout.min, lane.timeout.max);
    var entity = self.entityQueue.shift();
    entity.place(lane);
    self.entitiesActive.push(entity);
    //console.log("Car "+ car.id + " generated");
  });
}

/**
 * @function isOutOfBounds
 * Tests if the entity is out of the screen including a tolerance
 * @param {Object} entity object to be tested for
 * it's x and y coordinates
 */
function isOutOfBounds(entity) {
  return entity.x > this.canvasWidth
      || entity.x < (0 - entity.width)
      || entity.y > this.canvasHeight
      || entity.y < (0 - entity.height);
}

function pushBackEntity(index) {
  var entity = this.entitiesActive[index];
  this.entitiesActive.splice(index, 1);
  entity.reset();
  this.entityQueue.push(entity);
}

/**
 * @function detectEntities
 * Removes an entity from the active entities and pushes it
 * back to the entity queue (when entity is out of bounds)
 */
function detectEntities(){
  var i = this.entitiesActive.length;
  while(i--) {
    if(isOutOfBounds.call(this, this.entitiesActive[i])) {
      pushBackEntity.call(this, i);
    }
  }
}

/**
 * @function spotEntity
 * Iterates over each line, checks each line timeout,
 * places a new obstacle (entity) when allowed
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame
 */
function spotEntity(elapsedTime) {
  var self = this;
  var entity = undefined;
  this.lanes.forEach(function(lane) {
    lane.timer += elapsedTime;
    if(lane.timer > lane.timeout.current) {
      if(self.entityQueue.length) {
        lane.timer = 0;
        lane.timeout.current = self.lib.randomIntFromRange(lane.timeout.min, lane.timeout.max);
        entity = self.entityQueue.shift();
        entity.place(lane);
        self.entitiesActive.push(entity);
        //console.log(entity);
      }
    }
  });
}

Manager.prototype.resetLanes = function() {
  var i = this.entitiesActive.length;
  while(i--) {
    pushBackEntity.call(this, i);
  }
  this.init();
}

/**
 * @function updates the manager object
 * {DOMHighResTimeStamp} elapsedTime the elapsed time since the last frame
 */
Manager.prototype.update = function(elapsedTime) {
  // Detect entities out of bounds
  detectEntities.call(this);
  // Spot an entity
  spotEntity.call(this, elapsedTime);

  this.entitiesActive.forEach(function(entity) {
    entity.update(elapsedTime);
  });
}

/**
 * @function renders the active obstacles (entities) into the provided context
 * {DOMHighResTimeStamp} elapsedTime the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Manager.prototype.render = function(elapsedTime, ctx) {
  this.entitiesActive.forEach(function(entity) {
    entity.render(elapsedTime, ctx);
  });
}

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./log.js":6,"./manager.js":7}],11:[function(require,module,exports){
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

  setLanes.call(this);

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

function setLanes() {
  this.lanes = [
    // Cell number for a lane, width of a lane, height of a lane, cars direction in lane, speed of cars in pixels, timeout of a lane, current timer
    {cell: 1, width: this.laneWidth, height: this.canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 2.5, timeout: {min: 3500, max: 5000, current: 0}, timer: 0},
    {cell: 2, width: this.laneWidth, height: this.canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 3.2, timeout: {min: 2900, max: 4400, current: 0}, timer: 0},
    {cell: 3, width: this.laneWidth, height: this.canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 4.1, timeout: {min: 2400, max: 3900, current: 0}, timer: 0},
    {cell: 4, width: this.laneWidth, height: this.canvasHeight, direction: this.lib.randomIntFromRange(DOWN, UP), speed: 4.8, timeout: {min: 1800, max: 2900, current: 0}, timer: 0},
  ];
}

RoadManager.prototype.setLevel = function(level) {

  var self = this;
  this.lanes.forEach(function(lane) {
    lane.direction = self.lib.randomIntFromRange(DOWN, UP);
    lane.speed += Math.pow(level, 1/4) * 0.2;
    var decrease = self.lib.randomIntFromRange(90, 140);
    lane.timeout.min -= (lane.timeout.min > 700) ? decrease : 0;
    lane.timeout.max -= (lane.timeout.max > lane.timeout.min + decrease)? decrease : 0;
    lane.timer = 0;
  });

  this.resetLanes();

}

},{"./car-mini.js":2,"./car-racer.js":3,"./manager.js":7}]},{},[1]);
