import { GameState } from '../shared/GameState';
import { HeroActions } from '../shared/HeroActions';
import { Player } from '../shared/Player';
import { SocketProxy } from './SocketProxy';
import { Constants } from '../shared/Constants';

export class GameClient {

  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly gameState: GameState;
  readonly heroActions: HeroActions;
  readonly socketProxy: SocketProxy;

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById("canvasId");
    this.ctx = this.canvas.getContext('2d');
    this.canvas.setAttribute('width', Constants.CANVAS_WIDTH.toString());
    this.canvas.setAttribute('height', Constants.CANVAS_HEIGHT.toString());
    this.canvas.setAttribute('style', 'border:1px solid #000000;');

    // Make the canvas focusable so it can get keydown events.
    this.canvas.setAttribute('tabindex', '1');
    
    this.gameState = new GameState();

    this.socketProxy = new SocketProxy();
    this.socketProxy.subscribeToGameState((gameStateJsonObj) => {
      this.gameState.deserialize(gameStateJsonObj);
    });

    this.heroActions = new HeroActions();
    this.heroActions.addEventListeners(this.canvas);
  }

  gameLoop() {
    this.resetCamera();
    this.ctx.clearRect(0, 0, Constants.WORLD_WIDTH, Constants.WORLD_HEIGHT);
    this.centerCameraOnHero();
    this.gameState.draw(this.ctx);
    this.socketProxy.publishHeroActions(this.heroActions);
  }

  // Potentially factor this into camera class.

  resetCamera() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  centerCameraOnHero() {
    let socketId: string = this.socketProxy.getSocketId();
    let hero: Player = this.gameState.getPlayerById(socketId);

    console.log(socketId);
    console.log(hero);
  
    let newX0 = -hero.x + Constants.CANVAS_WIDTH / 2;
    let newY0 = -hero.y + Constants.CANVAS_HEIGHT / 2;

    console.log(newX0, newY0);

    this.ctx.translate(newX0, newY0);
    
  }
}
