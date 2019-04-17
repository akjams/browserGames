import { Sprite } from '../shared/Sprite';
import { Player } from '../shared/Player';
import { ServerSocketProxy } from './ServerSocketProxy';
import { HeroActions } from '../shared/HeroActions';
import { GameState } from '../shared/GameState';
import { Constants } from '../shared/Constants';
import { Utils } from '../shared/Utils';
import { FoodGenerator } from './FoodGenerator';

export class GameServer {

  gameState: GameState;
  socketProxy: ServerSocketProxy;
  foodGenerator: FoodGenerator;

  constructor(expressServer) {
    this.socketProxy = new ServerSocketProxy(
        expressServer,
        this.onNewPlayer,
        this.onPlayerDisconnect,
        this.onHeroActions);
    this.gameState = new GameState();
    this.foodGenerator = new FoodGenerator(this.gameState);
    
    setInterval(() => {
          this.gameState.tick();
          this.foodGenerator.tick();
          this.socketProxy.publishGameState(this.gameState);
        }, 1000 / 60);
  }

  onNewPlayer = (playerId: string): void => {
    let createdPlayer: Player = new Player(
        playerId, 
        Utils.randInt(0, Constants.CANVAS_WIDTH),
        Utils.randInt(0, Constants.CANVAS_HEIGHT));
    this.gameState.addPlayer(createdPlayer);
  }

  onPlayerDisconnect = (playerId: string): void => {
    this.gameState.removePlayerById(playerId);
  }

  onHeroActions = (playerId: string, heroActions: HeroActions): void => {
    let actingPlayer: Player = this.gameState.getPlayerById(playerId);
    if (actingPlayer === undefined) {
      // console.error('akxyz Trying to act on undefined player. Refresh browser.');
    } else {
      actingPlayer.setHeroActions(heroActions);
    }
  }
}
