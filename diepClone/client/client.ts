'use strict';

import { GameClient } from './GameClient';

let gameClient: GameClient = new GameClient();

let drawForever = () => {
  window.requestAnimationFrame(drawForever);
  gameClient.gameLoop();
}

drawForever();
