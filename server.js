// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
'use strict';

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

const POPULATION_SIZE = 20;
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 700;
const PLAYER_RADIUS = 20;

const PLAYER_RADIUS_GROW_RATE = 2;
const PLAYER_HP = 60;
const PLAYER_FIRERATE = 20;
const PLAYER_FIRERATE_GROW_RATE = 0.5;

const BULLET_RADIUS = 5;
const PLAYER_VELOCITY = 5;
const BULLET_VELOCITY = 10;
const ALL_COLORS = ['red', 'green', 'blue', 'yellow', 'pink', 'brown'];

// Game state
let gameState = {
  players: {},
  bullets: {},
  tick: function() {
    for (let key in this.players) {
      if (this.players.hasOwnProperty(key)) { 
        this.players[key].tick();
      }
    }
    for (let key in this.bullets) {
      if (this.bullets.hasOwnProperty(key)) {
        this.bullets[key].tick();
      }
    }
    this.handleCollision();
  },
  handleCollision: function() {

    // Handle bullet-player collision.
    for (let playerKey in this.players) {
      if (this.players.hasOwnProperty(playerKey)) { 
        let currPlayer = this.players[playerKey];

        for(let bulletKey in this.bullets) {
          if (this.bullets.hasOwnProperty(bulletKey)) {
            let currBullet = this.bullets[bulletKey];

            // Handle bullet hit player.
            if (currBullet.shooterId !== playerKey
              && doCirclesIntersect(currBullet, currPlayer.position)) {
              delete this.bullets[bulletKey];
              currPlayer.grow();
            }
          }
        }
      }
    }

    // Handle bullet collision.
    for(let bulletKey in this.bullets) {
      if (this.bullets.hasOwnProperty(bulletKey)) {
        let currBullet = this.bullets[bulletKey];
        // Handle bullet hit wall.
        if (isCircleOutsideWall(currBullet)) {
          console.log('bullet outside wall');
          delete this.bullets[bulletKey];
        }        
      }
    }    

    // Handle player collision.
    for (let playerKey in this.players) {
      if (this.players.hasOwnProperty(playerKey)) { 
        let currPlayer = this.players[playerKey];    
        // Handle hero hit wall.
        if (isCircleOutsideWall(currPlayer.position)) {
          console.log('player outside wall');
          delete this.players[playerKey];
        }
      }
    }
  }
};

function isCircleOutsideWall(c) {
  return c.x < 0 || c.x > SCREEN_WIDTH || c.y < 0 || c.y > SCREEN_HEIGHT;
}

function doCirclesIntersect(c1, c2) {
  let dx = c1.x - c2.x;
  let dy = c1.y - c2.y;
  let dTotal = Math.sqrt(dx * dx + dy * dy);
  let minCollisionDistance = (c1.r + c2.r) / 2;
  return dTotal < minCollisionDistance;
}

// Send the gameState to all sockets 60 times per second.
setInterval(() => {
  gameState.tick();
  io.sockets.emit('gameState', gameState);
}, 1000 / 60);

function createPlayer(playerId) {
  return {
    playerId: playerId,
    hp: PLAYER_HP,
    position: {
      x: randInt(0, SCREEN_WIDTH),
      y: randInt(0, SCREEN_HEIGHT),
      r: PLAYER_RADIUS
    },
    color: randomColor(),
    keysPressed: {
      w: false,
      a: false,
      s: false,
      d: false,
      mouse: {
        isDown: false,
        x: 0,
        y: 0
      }
    },
    gun: {
      fireRate: 20,
      fireCooldown: 0
    },
    grow: function() {
      this.position.r += PLAYER_RADIUS_GROW_RATE;
      this.gun.fireRate -= PLAYER_FIRERATE_GROW_RATE;
      this.gun.fireRate = Math.max(this.gun.fireRate, 1);
      this.hp--;
      if (this.hp <= 0) {
        delete gameState.players[this.playerId];
      }
    },
    tick: function() { 
      this.move();
      this.shoot();
    },
    move: function() {
      if (this.keysPressed.w) {
        this.position.y -= PLAYER_VELOCITY;
      }
      if (this.keysPressed.a) {
        this.position.x -= PLAYER_VELOCITY;
      }
      if (this.keysPressed.s) {
        this.position.y += PLAYER_VELOCITY;
      }
      if (this.keysPressed.d) {
        this.position.x += PLAYER_VELOCITY;
      }  
    },
    shoot: function() {
      if (this.keysPressed.mouse.isDown && this.gun.fireCooldown <= 0) {
        gameState.bullets[randomBulletId()] = createBullet(
          this.position.x,
          this.position.y,
          this.keysPressed.mouse.x,
          this.keysPressed.mouse.y,
        this.playerId);
        this.gun.fireCooldown = this.gun.fireRate;
      }
      if (this.gun.fireCooldown > 0) {
        this.gun.fireCooldown--;
      }
    }
  };
}

function createBullet(x, y, targetX, targetY, shooterId) {
  // This trig works by trial and error. It's confusing bc of the 
  // canvas coordinate system.
  var dy = (x - targetX);
  var dx = -(y - targetY);  
  var theta = Math.atan2(dy, dx) + Math.PI/2; // radians in range (-PI, PI].

  return {
    x: x,
    y: y,
    theta: theta,
    r: BULLET_RADIUS,
    shooterId: shooterId,
    tick: function() {
      this.move();
    },
    move: function() {
      this.x += BULLET_VELOCITY * Math.cos(this.theta);
      this.y += BULLET_VELOCITY * Math.sin(this.theta);
    }
  };
}

function randomBulletId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function randomColor() {
  return ALL_COLORS[randInt(0, ALL_COLORS.length - 1)];
}

// inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    socket.on('newPlayer', () => {
      gameState.players[socket.id] = createPlayer(socket.id);
    });

    socket.on('keysPressed', (keysPressed) => {
      if (gameState.players[socket.id] === undefined) {
        console.warn('getting keysPressed of undefined');
        return;
      }
      gameState.players[socket.id].keysPressed = keysPressed;
    });
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      delete gameState.players[socket.id];
    });
  }
);