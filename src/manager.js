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

/**
 * @function detectEntities
 * Removes an entity from the active entities and pushes it
 * back to the entity queue (when entity is out of bounds)
 */
function detectEntities(){
  var i = this.entitiesActive.length;
  var entity = undefined;
  while(i--) {
    if(isOutOfBounds.call(this, this.entitiesActive[i])) {
      entity = this.entitiesActive[i];
      this.entitiesActive.splice(i, 1);
      //console.log("Car " + car.id + " pushed back from " + (car.x / 64));
      entity.reset();
      this.entityQueue.push(entity);
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
