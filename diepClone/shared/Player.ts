import { Sprite } from './Sprite';
import { HeroActions } from './HeroActions';
import { Constants } from '../shared/Constants';
import { GameState } from '../shared/GameState';
import { Bullet } from './Bullet';
import { Utils } from './Utils';

export class Player implements Sprite {
  id: string;
  x: number;
  y: number;
  heroActions: HeroActions;
  gameState: GameState;

  experience: number = 0;
  currHp: number = 20;
  maxHp: number = 20;
  hpRegen: number = 0.01;
  maxReloadTime: number = 60; // Ticks to reload.
  currReloadTime: number = 0;
  bulletDamage: number = 1;
  bulletSpeed: number = 1;
  movementSpeed: number = 1;

  constructor(id: string, x: number, y: number, gameState?: GameState) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.gameState = gameState;
    this.heroActions = new HeroActions();
  }

  getId(): string {
    return this.id;
  }
  
  setHeroActions(heroActions: HeroActions): void {
    this.heroActions = heroActions;
  }

  tick() {
    let yvel = 0;
    let xvel = 0;
    if (this.heroActions.w) { yvel -= Constants.PLAYER_SPEED; }
    if (this.heroActions.s) { yvel += Constants.PLAYER_SPEED; }
    if (this.heroActions.a) { xvel -= Constants.PLAYER_SPEED; }
    if (this.heroActions.d) { xvel += Constants.PLAYER_SPEED; }
    this.x += xvel;
    this.y += yvel;

    // Shoot if we should.
    this.currReloadTime--;
    if (this.heroActions.mouseDown && this.currReloadTime <= 0) {
      this.currReloadTime = this.maxReloadTime;
      let bullet: Bullet = Bullet.fromShooter(this, xvel, yvel);
      this.gameState.addBullet(bullet);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = '#00DD00';
    ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    ctx.fill();
  }

  // TODO(ak): remove this, all deserialize() calls should be like fromJson().
  deserialize(jsonObj): void {
    this.id = jsonObj.id;
    this.x = jsonObj.x;
    this.y = jsonObj.y;
  }
  
  static fromJson(jsonObj): Player {
    return new Player(jsonObj.id, jsonObj.x, jsonObj.y);
  }

}
