// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;

// repeated constants in server.js and sketch.js
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 700;
const BULLET_COLOR = 'black';

// Race condition between drawing and setting this. Not anymore.
let currentGameState = {
  players: {}, // map: socketId -> player object.
  bullets: {}
};

let heroKeysPressed = {
  w: false,
  a: false,
  s: false,
  d: false,
  mouse: {
    isDown: false,
    x: 0,
    y: 0
  }
};

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  background(230);

  socket = io.connect('http://localhost:80');
  socket.emit('newPlayer', {});

  socket.on('gameState', receivedState => {
    currentGameState = receivedState;
  });
}

function draw() {
  background(230);
  let gameStateBeingDrawn = currentGameState;
  for (let key in gameStateBeingDrawn.players) {
    if (gameStateBeingDrawn.players.hasOwnProperty(key)) {
       drawPlayer(gameStateBeingDrawn.players[key]);
    }
  }
  for (let key  in gameStateBeingDrawn.bullets) {
    if (gameStateBeingDrawn.bullets.hasOwnProperty(key)) {
      drawBullet(gameStateBeingDrawn.bullets[key]);
    }
  }
}

function drawPlayer(player) {
  fill(player.color);
  ellipse(player.position.x, player.position.y,
    player.position.r, player.position.r);
  
  fill('black');
  textSize(10);
  text(`hp: ${player.hp}\nfr: ${player.gun.fireRate}`, player.position.x, player.position.y - player.position.r);
}

function drawBullet(bullet) {
  fill(BULLET_COLOR);
  ellipse(bullet.x, bullet.y, bullet.r, bullet.r);
}

function keyPressed() {
  keyAction(key, true);
}

function keyReleased() {
  keyAction(key, false);
}

function keyAction(keyString, isDown) {
  let lowerKey = keyString.toLowerCase();
  if ('wasd'.includes(lowerKey)) {
    heroKeysPressed[lowerKey] = isDown;
    socket.emit('keysPressed', heroKeysPressed);
  }
}

function mousePressed() {

  mouseAction(true);
}

function mouseReleased() {
  mouseAction(false);
}

function mouseAction(isDown) {
  heroKeysPressed.mouse.isDown = isDown;
  socket.emit('keysPressed', heroKeysPressed);
}

function mouseMoved() {
  mouseMovedOrDragged();
}

function mouseDragged() {
  mouseMovedOrDragged();
}

function mouseMovedOrDragged() {
  heroKeysPressed.mouse.x = mouseX;
  heroKeysPressed.mouse.y = mouseY;
  socket.emit('keysPressed', heroKeysPressed);  
}