// import * as io from 'socket.io-client';

import { HeroActions } from '../shared/HeroActions';
import { GameState } from '../shared/GameState';

export class SocketProxy {
  static readonly SERVER_URL = 'http://localhost:80';

  socketId: string;
  socket: SocketIOClient.Socket;

  constructor() {
    // Use the io in the global namespace rather than
    // importing, because importing resulted in a weird
    // import chain: socket.io-client -> socket.io -> express.
    this.socket = io(SocketProxy.SERVER_URL);
    this.socket.emit('newPlayer', {});
  }

  publishHeroActions(heroActions: HeroActions): void {
    this.socket.emit('heroActions', heroActions); 
  }

  subscribeToGameState(callback): void {
    this.socket.on('gameState', callback);
  }


}
