import { GameState } from '../shared/GameState';
import { HeroActions } from '../shared/HeroActions';
import { Player } from '../shared/Player';
import { SocketProxy } from './SocketProxy';
import { Constants } from '../shared/Constants';

export class GameDriver {

  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly gameState: GameState;
  readonly heroActions: HeroActions;
  readonly socketProxy: SocketProxy;

  constructor() {
    this.canvas = <HTMLCanvasElement> document.getElementById("canvasId");
    this.ctx = this.canvas.getContext('2d');
    this.canvas.setAttribute('width', Constants.WIDTH.toString());
    this.canvas.setAttribute('height', Constants.HEIGHT.toString());
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameState.draw(this.ctx);
    this.socketProxy.publishHeroActions(this.heroActions);
  }
}
