import { Sprite } from '../shared/Sprite';
import { Player } from '../shared/Player';
import { ServerSocketProxy } from './ServerSocketProxy';
import { HeroActions } from '../shared/HeroActions';
import { GameState } from '../shared/GameState';
import { Constants } from '../shared/Constants';
import { Utils } from '../shared/Utils';

export class GameServer {

  gameState: GameState;
  socketProxy: ServerSocketProxy;

  constructor(expressServer) {
    this.socketProxy = new ServerSocketProxy(expressServer, this.onNewPlayer, this.onHeroActions);
    this.gameState = new GameState();
    
    setInterval(() => {
          this.gameState.tick();
          this.socketProxy.publishGameState(this.gameState);
        }, 1000 / 60);
  }

  onNewPlayer = (playerId: string): void => {
    let createdPlayer: Player = new Player(
        playerId, 
        Utils.randInt(0, Constants.WIDTH),
        Utils.randInt(0, Constants.HEIGHT));
    this.gameState.addPlayer(createdPlayer);
  }

  onHeroActions = (playerId: string, heroActions: HeroActions): void => {
    this.gameState.getPlayerById(playerId).setHeroActions(heroActions);
  }
}
