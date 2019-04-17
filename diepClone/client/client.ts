'use strict';

import { GameDriver } from './GameDriver';

let gameDriver: GameDriver = new GameDriver();

let drawForever = () => {
  window.requestAnimationFrame(drawForever);
  gameDriver.gameLoop();
}

drawForever();
