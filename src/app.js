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
