import * as socketIo from 'socket.io';

import { HeroActions } from '../shared/HeroActions';
import { GameState } from '../shared/GameState';

export class ServerSocketProxy {

  io: SocketIO.Server;

  constructor(
      expressServer,
      newPlayerCallback: (id: string) => void,
      heroActionsCallback: (id: string, ha: HeroActions) => void) {
    
    this.io = socketIo(expressServer);
    this.io.sockets.on('connection', (socket) => {
      socket.on('newPlayer', () => {
        newPlayerCallback(socket.id);
      });
      socket.on('heroActions', (jsonHeroActions) => {
        let heroActions: HeroActions = new HeroActions();
        heroActions.deserialize(jsonHeroActions);
        heroActionsCallback(socket.id, heroActions);
      });
    });
  }

  publishGameState(gameState: GameState): void {
    this.io.sockets.emit('gameState', gameState.serialize());
  }
}
