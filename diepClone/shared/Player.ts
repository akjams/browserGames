import { Sprite } from './Sprite';
import { HeroActions } from './HeroActions';
import { Constants } from '../shared/Constants';
export class Player implements Sprite {
  id: string;
  x: number;
  y: number;
  heroActions: HeroActions;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
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
