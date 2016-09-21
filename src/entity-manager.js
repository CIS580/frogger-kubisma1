"use strict";

module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.numberOfCells = this.widthInCells * this.heightInCells;
  this.cells = [];
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function cellIndex(position) {
  var x = Math.floor(position.x / this.cellSize);
  var y = Math.floor(position.y / this.cellSize);
  if(x >= this.widthInCells || y >= this.heightInCells || x < 0 || y < 0)
    return -1;
  else
    return y + this.widthInCells * x;
}

// Adds an entity to array
EntityManager.prototype.add = function(entity) {
  var index = cellIndex(entity);
  this.cells[index].push(entity);
  entity._cell = index;
}

// Removes an entity from array
EntityManager.prototype.remove = function(entity) {
  var index = this.cells[entity._cellIndex].indexOf(entity);
  if(index != -1) this.cells[entity._cellIndex].splice(index, 1);
}

// For each entity update their state
EntityManager.prototype.update = function(entity) {
  this.cells.forEach(function(cell) {
    cells.forEach(function(entity){
      entity.update(elapsedTime);
      var index = cellIndex(entity);
      if (index != entity._cell) {
        // Remove from old cell
        var subIndex = this.cells[entity._cell].indexOf(entity);
        if(subIndex != -1) this.cells[entity._cell].splice(subIndex, 1);
        // Place in new cell
        this.cells[index].push(entity);
        entity._cell = index;
      }
    });
  });
}

// Render all entities
EntityManager.prototype.render = function(elapsedTime, context, viewport) {
  // Min x range
  var xMin = Math.floor(viewport.x / this.cellSize);
  xMin = (xMin > 0) ? xMin : 0;

  // Max x range
  var xMax = Math.ceil((viewport.x + viewport.width)/this.cellSize) + 1;
  xMax = (xMax < this.widthInCells) ? xMax : this.widthInCells;

  // Min y range
  var yMin = Math.floor(viewport.y / this.cellSize);
  yMin = (yMin > 0) ? yMin : 0;

  // Max y range
  var yMax = Math.ceil((viewport.y + viewport.height)/this.cellSize) + 1;
  yMax = (yMax < this.widthInCells) ? yMax : this.widthInCells;

  // iterate over included cells
  for(var x = xMin; x < xMax; x++) {
    for(var y = yMin; y < yMax; y++) {
      this.cells[y * this.widthInCells + x].forEach(function(entity)) {
        entity.render(elapsedTime, context);
      });
    }
  }
}

function testForRectCollision(e1, e2) {
  return !( e1.x > e2.x + e2.width ||
            e1.x + e1.width < e2.width ||
            e1.y > e2.y + e2.height ||
            e1.y + e1.height < e2.y
          );
}

EntityManager.prototype.queryRect = function(x, y, width, height) {
  var results = [];

  // Min x range
  var xMin = Math.floor(x / this.cellSize);
  xMin = (xMin > 0) ? xMin : 0;

  // Max x range
  var xMax = Math.ceil((x + width)/this.cellSize) + 1;
  xMax = (xMax < this.widthInCells) ? xMax : this.widthInCells;

  // Min y range
  var yMin = Math.floor(y / this.cellSize);
  yMin = (yMin > 0) ? yMin : 0;

  // Max y range
  var yMax = Math.ceil((y + height)/this.cellSize) + 1;
  yMax = (yMax < this.widthInCells) ? yMax : this.widthInCells;

  // iterate over included cells
  for(var x = xMin; x < xMax; x++) {
    for(var y = yMin; y < yMax; y++) {
      results.concat(
        this.cells[y * this.widthInCells + x].filter(function(entity) {
          return testForRectCollision(entity, {x: x, y: y, width: width, height: height});
        }
      );
    }
  }
  return results;
}

EntityManager.prototype.processCollisions = function(callback) {
  this.cells.forEach(function(cell, index){

    // Check for collisions between entities within this cell
    cell.forEach(function(entity1){
      cell.forEach(function(entity2){
        if(entity1 !=== entity2 && testForRectCollision(entity1, entity1)
          callback(entity1, entity2);
      });
    });

    // Check for collisions between entities within this cell
    // and its neighbor to the right
    if((index + 1) % this.widthInCells != 0) {
      cell.forEach(function(entity1){
        this.cells[index+1].forEach(function(entity2){
          if(entity1 !=== entity2 && testForRectCollision(entity1, entity1)
            callback(entity1, entity2);
        });
      });
    }

    // Check for collisions between entities within this cell
    // and the cell beneath it
    if(index >= this.numberOfCells - this.widthInCells) {
      cell.forEach(function(entity1){
        this.cells[index+this.widthInCells].forEach(function(entity2){
          if(entity1 !=== entity2 && testForRectCollision(entity1, entity1)
            callback(entity1, entity2);
        });
      });
    }

    // Check for collisions between entities within this cell
    // and the cell diagonally beneath to the right
    if((index + 2) % this.widthInCells != 0 && index >= this.numberOfCells - this.widthInCells) {
      cell.forEach(function(entity1){
        this.cells[index+this.widthInCells+1].forEach(function(entity2){
          if(entity1 !=== entity2 && testForRectCollision(entity1, entity1)
            callback(entity1, entity2);
        });
      });
    }

  });

}
